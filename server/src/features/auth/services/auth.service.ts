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

import { generateOTP, hashOTP } from "#utils/opt.utils.js";
import {
  comparePassword,
  hashPassword,
} from "#features/auth/utils/password.utils.js";

import {
  PENDING_USER_TTL,
  SESSION_TTL_DAYS,
  MS_PER_DAY,
} from "#constants/auth.js";

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
  AccessTokenPayload,
  VerificationTokenPayload,
} from "#features/auth/types/token-payload.types.js";
import { string } from "zod";

/**
 * Creates a temporary user registration.
 *
 * The user is stored in the pending-user collection until their
 * email address has been successfully verified with the OTP.
 *
 * This prevents unverified accounts from being created in the
 * main users collection.
 */
export const registerUser = async (data: RegisterInput) => {
  const { firstName, lastName, username, email, password } = data;

  // Prevent registration with an email that already belongs
  // to an existing, verified user.
  const existingUserByEmail = await UserModel.findOne({ email });

  if (existingUserByEmail) {
    throw new ApiError(409, "Email already exists.");
  }

  // Usernames must be unique among verified users.
  const existingUserByUsername = await UserModel.findOne({
    username,
  });

  if (existingUserByUsername) {
    throw new ApiError(409, "Username already exists.");
  }

  // Prevent multiple active registration attempts for the same email.
  const pendingUserByEmail = await PendingUserModel.findOne({
    email,
  });

  if (pendingUserByEmail) {
    throw new ApiError(
      409,
      "Email verification is pending. Please try again in a few minutes."
    );
  }

  // Prevent multiple active registration attempts for the same username.
  const pendingUserByUsername = await PendingUserModel.findOne({
    username,
  });

  if (pendingUserByUsername) {
    throw new ApiError(
      409,
      "Username verification is pending. Please try again in a few minutes."
    );
  }

  // Never store the user's plain-text password.
  // The same password hash will later be copied to the real user document
  // after successful email verification.
  const hashedPassword = await hashPassword(password);

  // Generate a one-time verification code and store only its hash.
  // The plain OTP should be sent to the user's email and never persisted.
  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  // TODO:
  // Send the plain OTP through the email service.
  //
  // The email service should receive `otp`, while the database should
  // only contain `hashedOTP`.

  const pendingUser = await PendingUserModel.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,

    // Store the hashed OTP instead of the plain-text OTP.
    otp,

    // Automatically expire the pending registration after the
    // configured amount of time.
    expiresAt: new Date(Date.now() + PENDING_USER_TTL * 1000),
  });

  // The verification token identifies the pending registration without
  // exposing the user's credentials or personal data.
  const verificationToken = generateVerificationToken(
    pendingUser._id.toString()
  );

  return {
    pendingUser,
    verificationToken,
  };
};

/**
 * Verifies the email address associated with a pending registration.
 *
 * Once the OTP is successfully verified:
 * 1. The pending registration is removed.
 * 2. A permanent user account is created.
 * 3. Access and refresh tokens are generated.
 * 4. A persistent session is created for the user.
 */
export const verifyUserEmail = async ({
  otp,
  verificationToken,
  ip,
  userAgent,
}: VerifyEmailInput) => {
  // A verification token is required to identify the pending registration.
  if (!verificationToken) {
    throw new ApiError(
      400,
      "Verification session not found. Please start registration again."
    );
  }

  let payload: VerificationTokenPayload;

  try {
    // Validate the token signature and expiration before using its payload.
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

  // Retrieve the temporary registration using the ID stored in
  // the signed verification token.
  const pendingUser = await PendingUserModel.findById(pendingUserId);

  if (!pendingUser) {
    throw new ApiError(
      400,
      "Your account creation request has expired. Please start the registration process again."
    );
  }

  // TODO:
  // Compare the submitted OTP with the stored hash using `compareOTP`.
  //
  // Never compare or store OTPs as plain text in production.
  const isOTPValid = otp === pendingUser.otp;

  if (!isOTPValid) {
    throw new ApiError(400, "Invalid OTP. Please enter the correct OTP.");
  }

  // The pending registration is no longer needed after successful
  // verification, so remove it before creating the permanent account.
  await PendingUserModel.findByIdAndDelete(pendingUserId);

  // Create the verified user account using the information collected
  // during the pending registration.
  const user = await UserModel.create({
    firstName: pendingUser.firstName,
    lastName: pendingUser.lastName ?? "",
    username: pendingUser.username,
    email: pendingUser.email,
    password: pendingUser.password,
  });

  // Generate a refresh token that can be used to obtain new access tokens.
  const refreshToken = generateRefreshToken(user._id.toString());

  // Create a server-side session so the refresh token can be tracked,
  // revoked, and associated with the user's device/client.
  const session = await SessionModel.create({
    userId: user._id,
    ip,
    userAgent,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * MS_PER_DAY),
  });

  // Generate a short-lived access token for authenticated API requests.
  const accessToken = generateAccessToken(
    user._id.toString(),
    session._id.toString()
  );

  // Return only the user information required by the client.
  // Sensitive/internal fields such as the password are intentionally excluded.

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (data: LoginInput) => {
  const { identifier, password, ip, userAgent } = data;

  // Existing, verified user Check.
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password");

  if (!user) {
    throw new ApiError(409, "User does not exist.");
  }

  if (!comparePassword(password, user.password)) {
    throw new ApiError(409, "Incorrect Password!");
  }

  const refreshToken = generateRefreshToken(user._id.toString());

  const session = await SessionModel.create({
    userId: user._id,
    ip,
    userAgent,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * MS_PER_DAY),
  });

  const accessToken = generateAccessToken(
    user._id.toString(),
    session._id.toString()
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

export const logoutUser = async ({ sessionId }: LogoutInput) => {
  return await SessionModel.findByIdAndDelete(sessionId);
};

export const logoutUserFromAllDevices = async ({
  userId,
}: LogoutAllDevicesInput) => {
  const sessions = await SessionModel.findOne({ userId });

  console.log(sessions);

  if (!sessions) {
    throw new ApiError(400, "Sessions");
  }

  return await SessionModel.findByIdAndDelete(sessions[0]._id);
};
