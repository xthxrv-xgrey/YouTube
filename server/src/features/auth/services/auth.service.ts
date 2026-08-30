import jwt from "jsonwebtoken";

import { PendingUserModel } from "#features/auth/models/pending-user.model.js";
import { UserModel } from "#features/user/user.model.js";
import { SessionModel } from "../models/session.model.js";

import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
} from "#utils/token.utils.js";

import { generateOTP, hashOTP } from "#utils/opt.utils.js";
import { hashPassword } from "../utils/password.utils.js";

import {
  PENDING_USER_TTL,
  SESSION_TTL_DAYS,
  MS_PER_DAY,
} from "#constants/auth.js";

import env from "#config/env.js";
import ApiError from "#core/errors/ApiError.js";

import type { RegisterInput, VerifyEmailInput } from "../types/auth.types.js";
import type { VerificationTokenPayload } from "../types/token-payload.types.js";

/**
 * Registers a new user by creating a pending account.
 *
 * The user is stored temporarily until their email
 * verification OTP is successfully verified.
 */
export const registerUser = async (data: RegisterInput) => {
  const { firstName, lastName, username, email, password } = data;

  // Check whether the email is already registered.
  const existingUserByEmail = await UserModel.findOne({ email });

  if (existingUserByEmail) {
    throw new ApiError(409, "Email already exists.");
  }

  // Check whether the username is already registered.
  const existingUserByUsername = await UserModel.findOne({
    username,
  });

  if (existingUserByUsername) {
    throw new ApiError(409, "Username already exists.");
  }

  // Check whether there is already a pending registration
  // for this email.
  const pendingUserByEmail = await PendingUserModel.findOne({
    email,
  });

  if (pendingUserByEmail) {
    throw new ApiError(
      409,
      "Email verification is pending. Please try again in a few minutes."
    );
  }

  // Check whether there is already a pending registration
  // for this username.
  const pendingUserByUsername = await PendingUserModel.findOne({
    username,
  });

  if (pendingUserByUsername) {
    throw new ApiError(
      409,
      "Username verification is pending. Please try again in a few minutes."
    );
  }

  // Hash password before storing it.
  const hashedPassword = await hashPassword(password);

  // Generate OTP and store its hash.
  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  // TODO:
  // Send OTP to user's email once email service is implemented.

  const pendingUser = await PendingUserModel.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,

    // Use hashedOTP once OTP verification is implemented
    // securely through the email service.
    otp,

    expiresAt: new Date(Date.now() + PENDING_USER_TTL * 1000),
  });

  // Generate a token identifying this pending registration.
  const verificationToken = generateVerificationToken(
    pendingUser._id.toString()
  );

  return {
    pendingUser,
    verificationToken,
  };
};

/**
 * Verifies a user's email and creates the actual user account.
 */
export const verifyUserEmail = async ({
  otp,
  verificationToken,
  ip,
  userAgent,
}: VerifyEmailInput) => {
  // Make sure the verification token exists.
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

  const { pendingUserId } = payload;

  const pendingUser = await PendingUserModel.findById(pendingUserId);

  if (!pendingUser) {
    throw new ApiError(
      400,
      "Your account creation request has expired. Please start the registration process again."
    );
  }

  // TODO:
  // Replace direct comparison with compareOTP once email
  // verification is implemented properly.
  if (otp !== pendingUser.otp) {
    throw new ApiError(400, "Invalid OTP. Please enter the correct OTP.");
  }

  // Remove the pending registration.
  await PendingUserModel.findByIdAndDelete(pendingUserId);

  // Create the actual user account.
  const user = await UserModel.create({
    firstName: pendingUser.firstName,
    lastName: pendingUser.lastName,
    username: pendingUser.username,
    email: pendingUser.email,
    password: pendingUser.password,
  });

  // Generate authentication tokens.
  const accessToken = generateAccessToken(user._id.toString());

  const refreshToken = generateRefreshToken(user._id.toString());

  // Create user session.
  const session = await SessionModel.create({
    userId: user._id,
    ip,
    userAgent,
    refreshTokenHash: refreshToken,
    expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * MS_PER_DAY),
  });

  const responseUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    accessToken,
    session,
  };

  return {
    user: responseUser,
    refreshToken,
  };
};
