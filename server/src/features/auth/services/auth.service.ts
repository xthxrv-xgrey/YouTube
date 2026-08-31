import jwt from "jsonwebtoken";

import { PendingUserModel } from "#features/auth/models/pending-user.model.js";
import { UserModel } from "#features/user/user.model.js";
import { SessionModel } from "#features/auth/models/session.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  hashRefreshToken,
} from "#utils/token.utils.js";

import {
  generateOTP,
  hashOTP,
  compareOTP,
  sendEmailVerificationOTP,
  sendPasswordResetOTP,
} from "#utils/otp.utils.js";

import {
  comparePassword,
  hashPassword,
} from "#features/auth/utils/password.utils.js";

import {
  createSessionAndTokens,
  getSessionExpiry,
  getVerificationExpirty,
} from "#features/auth/utils/auth.utils.js";

import env from "#config/env.js";
import ApiError from "#core/errors/ApiError.js";

import type {
  RegisterInput,
  VerifyEmailInput,
  LoginInput,
  LogoutInput,
  LogoutAllDevicesInput,
  ChangePasswordInput,
  ResetPasswordInput,
} from "#features/auth/types/auth.types.js";

import type {
  RefreshTokenPayload,
  VerificationTokenPayload,
} from "#features/auth/types/token-payload.types.js";

import { PasswordResetModel } from "../models/password-reset.model.js";
import { OTP_ATTEMPT_LIMIT } from "#constants/auth.js";

/**
 * Registers a new user as a pending registration.
 */
export const registerService = async (data: RegisterInput) => {
  const { firstName, lastName, username, email, password } = data;

  const existingUserByEmail = await UserModel.findOne({ email });
  if (existingUserByEmail) {
    throw new ApiError(409, "Email already exists.");
  }

  const existingUserByUsername = await UserModel.findOne({ username });
  if (existingUserByUsername) {
    throw new ApiError(409, "Username already exists.");
  }

  const pendingUserByEmail = await PendingUserModel.findOne({ email });
  if (pendingUserByEmail) {
    throw new ApiError(
      409,
      "Email verification is pending. Please try again in a few minutes."
    );
  }

  const pendingUserByUsername = await PendingUserModel.findOne({ username });
  if (pendingUserByUsername) {
    throw new ApiError(
      409,
      "Username verification is pending. Please try again in a few minutes."
    );
  }

  const hashedPassword = await hashPassword(password);

  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  if (!(await sendEmailVerificationOTP(email, otp))) {
    throw new ApiError(
      400,
      "Unable to send the verification email. Please try again later."
    );
  }

  const pendingUser = await PendingUserModel.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    otpHash: hashedOTP,
    expiresAt: getVerificationExpirty(),
  });

  const verificationToken = generateVerificationToken(
    pendingUser._id.toString()
  );

  return {
    pendingUser,
    verificationToken,
  };
};

/**
 * Verifies a user's email address and starts a session.
 */
export const verifyEmailService = async ({
  otp,
  verificationToken,
  ip,
  userAgent,
}: VerifyEmailInput) => {
  if (!verificationToken) {
    throw new ApiError(
      400,
      "Verification session not found. Please start registration again."
    );
  }

  let payload: VerificationTokenPayload;

  try {
    payload = jwt.verify(
      verificationToken,
      env.VERIFICATION_TOKEN_SECRET
    ) as VerificationTokenPayload;
  } catch {
    throw new ApiError(
      400,
      "Your verification session has expired. Please start registration again."
    );
  }

  if (payload.purpose !== "email_verification") {
    throw new ApiError(400, "Invalid verification session.");
  }

  const { tokenId } = payload;

  const pendingUser = await PendingUserModel.findById(tokenId);

  if (!pendingUser) {
    throw new ApiError(
      400,
      "Your account creation request has expired. Please start the registration process again."
    );
  }

  const isOTPValid = await compareOTP(otp, pendingUser.otpHash);

  if (!isOTPValid) {
    throw new ApiError(400, "Invalid OTP. Please enter the correct OTP.");
  }

  await PendingUserModel.findByIdAndDelete(tokenId);

  const user = await UserModel.create({
    firstName: pendingUser.firstName,
    lastName: pendingUser.lastName ?? "",
    username: pendingUser.username,
    email: pendingUser.email,
    password: pendingUser.password,
  });

  const { accessToken, refreshToken } = await createSessionAndTokens(
    user._id.toString(),
    ip,
    userAgent
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

/**
 * Authenticates a user and starts a new session.
 */
export const loginService = async (data: LoginInput) => {
  const { identifier, password, ip, userAgent } = data;

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password.");
  }

  const { accessToken, refreshToken } = await createSessionAndTokens(
    user._id.toString(),
    ip,
    userAgent
  );

  const safeUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Logs a user out of the current device/session.
 */
export const logoutService = async ({ sessionId }: LogoutInput) => {
  return await SessionModel.findByIdAndDelete(sessionId);
};

/**
 * Logs a user out of every device.
 */
export const logoutAllDevicesService = async ({
  userId,
}: LogoutAllDevicesInput) => {
  const result = await SessionModel.deleteMany({ userId });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No active sessions found.");
  }

  return result;
};

/**
 * Rotates the refresh token and issues a new access/refresh pair.
 */
export const refreshService = async (oldRefreshToken: string | undefined) => {
  if (!oldRefreshToken) {
    throw new ApiError(401, "No refresh token provided. Please log in again.");
  }

  let payload: RefreshTokenPayload;

  try {
    payload = jwt.verify(
      oldRefreshToken,
      env.REFRESH_TOKEN_SECRET
    ) as RefreshTokenPayload;
  } catch {
    throw new ApiError(401, "Refresh token expired. Please log in again.");
  }

  const { userId, sessionId } = payload;

  const session =
    await SessionModel.findById(sessionId).select("+refreshTokenHash");

  if (!session || session.userId.toString() !== userId) {
    throw new ApiError(401, "Session not found. Please log in again.");
  }

  const incomingTokenHash = hashRefreshToken(oldRefreshToken);

  if (incomingTokenHash !== session.refreshTokenHash) {
    await SessionModel.deleteMany({ userId });

    throw new ApiError(
      401,
      "Refresh token reuse detected. All sessions have been logged out for your safety. Please log in again."
    );
  }

  const refreshToken = generateRefreshToken(userId, sessionId);
  const accessToken = generateAccessToken(userId, sessionId);

  session.refreshTokenHash = hashRefreshToken(refreshToken);
  session.expiresAt = getSessionExpiry();

  await session.save();

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Changes the authenticated user's password.
 */
export const changePasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}: ChangePasswordInput) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  const isSamePassword = await comparePassword(newPassword, user.password);

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password."
    );
  }

  user.password = await hashPassword(newPassword);

  await user.save();
};

/**
 * Initiates a password reset. Returns a null token when no account
 * matches the identifier so the controller can avoid leaking account
 * existence via the cookie.
 */
export const forgotPasswordService = async (identifier: string) => {
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return { verificationToken: null };
  }

  const pendingPasswordResetReqest = await PasswordResetModel.find({
    userId: user._id,
  });

  if (pendingPasswordResetReqest)
    throw new ApiError(
      400,
      "Password Request pending please try after few mins"
    );

  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  if (!(await sendPasswordResetOTP(user.email, otp))) {
    throw new ApiError(
      400,
      "Unable to send the verification email. Please try again later."
    );
  }

  const passwordReset = await PasswordResetModel.create({
    userId: user._id,
    otpHash: hashedOTP,
    expiresAt: getVerificationExpirty(),
  });

  const verificationToken = generateVerificationToken(
    passwordReset._id.toString()
  );

  return { verificationToken };
};

/**
 * Completes a password reset: verifies the OTP, updates the password,
 * revokes all existing sessions, and starts a fresh session.
 */
export const resetPasswordService = async ({
  verificationToken,
  otp,
  newPassword,
  ip,
  userAgent,
}: ResetPasswordInput) => {
  if (!verificationToken) {
    throw new ApiError(
      400,
      "Password reset session not found. Please request a new reset."
    );
  }

  let payload: VerificationTokenPayload;

  try {
    payload = jwt.verify(
      verificationToken,
      env.VERIFICATION_TOKEN_SECRET
    ) as VerificationTokenPayload;
  } catch {
    throw new ApiError(
      400,
      "Your verification token has expired. Please request a new password reset."
    );
  }

  if (payload.purpose !== "password_reset") {
    throw new ApiError(400, "Invalid verification session.");
  }

  const { tokenId } = payload;
  const passwordReset = await PasswordResetModel.findById(tokenId);

  if (!passwordReset) {
    throw new ApiError(400, "Password reset session expired.");
  }

  if (passwordReset.attempts >= OTP_ATTEMPT_LIMIT) {
    throw new ApiError(429, "Password reset attempt limit reached.");
  }

  const isOTPValid = await compareOTP(otp, passwordReset.otpHash);

  if (!isOTPValid) {
    await PasswordResetModel.findByIdAndUpdate(passwordReset._id, {
      attempts: passwordReset.attempts + 1,
    });
    throw new ApiError(400, "Invalid OTP.");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  // Bug fix: must update by passwordReset.userId, not passwordReset._id
  // (the reset document's own ID) — otherwise this updates the wrong
  // document (or nothing) and the user's password never actually changes.
  const user = await UserModel.findByIdAndUpdate(
    passwordReset.userId,
    { password: hashedNewPassword },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await PasswordResetModel.findByIdAndDelete(passwordReset._id);

  // Revoke every existing session before issuing a new one, so a
  // stolen session can't survive a password reset.
  await logoutAllDevicesService({ userId: user._id.toString() });

  const { accessToken, refreshToken } = await createSessionAndTokens(
    user._id.toString(),
    ip,
    userAgent
  );

  return { user, accessToken, refreshToken };
};
