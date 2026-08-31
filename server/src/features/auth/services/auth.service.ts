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
} from "#utils/opt.utils.js";
import {
  comparePassword,
  hashPassword,
} from "#features/auth/utils/password.utils.js";

import {
  createSessionAndTokens,
  getSessionExpiry,
} from "#features/auth/utils/auth.utils.js";

import { PENDING_USER_TTL } from "#constants/auth.js";

import env from "#config/env.js";
import ApiError from "#core/errors/ApiError.js";

import type {
  RegisterInput,
  VerifyEmailInput,
  LoginInput,
  LogoutInput,
  LogoutAllDevicesInput,
} from "#features/auth/types/auth.types.js";

import type {
  RefreshTokenPayload,
  VerificationTokenPayload,
} from "#features/auth/types/token-payload.types.js";

/**
 * Registers a new user as a "pending" registration.
 *
 * The user is stored in the pending-user collection until their
 * email address has been verified with an OTP. This keeps
 * unverified accounts out of the main users collection entirely.
 */
export const registerUser = async (data: RegisterInput) => {
  const { firstName, lastName, username, email, password } = data;

  // An email already tied to a verified account can't register again.
  const existingUserByEmail = await UserModel.findOne({ email });
  if (existingUserByEmail) {
    throw new ApiError(409, "Email already exists.");
  }

  // Usernames must be unique among verified users.
  const existingUserByUsername = await UserModel.findOne({ username });
  if (existingUserByUsername) {
    throw new ApiError(409, "Username already exists.");
  }

  // Only one active registration attempt is allowed per email...
  const pendingUserByEmail = await PendingUserModel.findOne({ email });
  if (pendingUserByEmail) {
    throw new ApiError(
      409,
      "Email verification is pending. Please try again in a few minutes."
    );
  }

  // ...and per username.
  const pendingUserByUsername = await PendingUserModel.findOne({ username });
  if (pendingUserByUsername) {
    throw new ApiError(
      409,
      "Username verification is pending. Please try again in a few minutes."
    );
  }

  // Never persist the plain-text password. The hash is copied over to
  // the real user document once email verification succeeds.
  const hashedPassword = await hashPassword(password);

  // Generate a one-time verification code. Only the hash is persisted;
  // the plain OTP is sent to the user's email and discarded immediately.
  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  if (!(await sendEmailVerificationOTP(email, otp))) {
    throw new ApiError(
      400,
      "Unable to send the verification email. Please try again later."
    );
  }
  // The database must only ever see `hashedOTP`, never `otp`.

  const pendingUser = await PendingUserModel.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    otp: hashedOTP,
    expiresAt: new Date(Date.now() + PENDING_USER_TTL * 1000),
  });

  // The verification token identifies the pending registration without
  // exposing any credentials or personal data.
  const verificationToken = generateVerificationToken(
    pendingUser._id.toString()
  );

  return {
    pendingUser,
    verificationToken,
  };
};

/**
 * Verifies the email address tied to a pending registration.
 *
 * On success:
 * 1. The pending registration is deleted.
 * 2. A permanent user account is created.
 * 3. A session is created and access/refresh tokens are issued.
 */
export const verifyUserEmail = async ({
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

  const { pendingUserId } = payload;

  const pendingUser = await PendingUserModel.findById(pendingUserId);
  if (!pendingUser) {
    throw new ApiError(
      400,
      "Your account creation request has expired. Please start the registration process again."
    );
  }

  // Compare against the stored hash — never compare plaintext OTPs.
  const isOTPValid = await compareOTP(otp, pendingUser.otp);
  if (!isOTPValid) {
    throw new ApiError(400, "Invalid OTP. Please enter the correct OTP.");
  }

  // The pending registration is no longer needed once verified.
  await PendingUserModel.findByIdAndDelete(pendingUserId);

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

  // Sensitive/internal fields (e.g. password) are intentionally excluded.
  return {
    user,
    accessToken,
    refreshToken,
  };
};

/**
 * Authenticates an existing, verified user with an email/username
 * and password, and issues a new session.
 */
export const loginUser = async (data: LoginInput) => {
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
 * Logs a user out of a single device by deleting that device's session.
 */
export const logoutUser = async ({ sessionId }: LogoutInput) => {
  return await SessionModel.findByIdAndDelete(sessionId);
};

/**
 * Logs a user out of every device by deleting all of their sessions.
 */
export const logoutUserFromAllDevices = async ({
  userId,
}: LogoutAllDevicesInput) => {
  const result = await SessionModel.deleteMany({ userId });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No active sessions found.");
  }

  return result;
};

/**
 * Rotates a refresh token: verifies it, checks it against the hash
 * on file for its session, and issues a fresh access/refresh pair.
 *
 * Reuse detection: a refresh token that verifies correctly but no
 * longer matches its session's stored hash means it was already
 * rotated away earlier — i.e. someone is replaying a stolen token.
 * When that happens, every session for the user is torn down and
 * they're forced to log in again everywhere.
 */
export const refreshTokens = async (oldRefreshToken: string | undefined) => {
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

  // Look up by session ID, not by hash — this is what lets us tell
  // "session gone" apart from "token replayed" below.
  const session =
    await SessionModel.findById(sessionId).select("+refreshTokenHash");

  if (!session || session.userId.toString() !== userId) {
    throw new ApiError(401, "Session not found. Please log in again.");
  }

  const incomingTokenHash = hashRefreshToken(oldRefreshToken);

  if (incomingTokenHash !== session.refreshTokenHash) {
    // Valid signature, valid session ID, but the hash is stale —
    // this exact token was already used and rotated out once
    // before. Treat it as theft: burn every session for this user.
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

  return { accessToken, refreshToken };
};
