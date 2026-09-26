import ApiError from "#core/errors/ApiError.js";

import UnverifiedUserModel from "../models/unverified-user.model.js";
import SessionModel from "../models/session.model.js";
import UserModel from "#features/user/models/user.model.js";

import { VerificationTokenPurpose } from "../types/token-payload.types";
import { compareOTP } from "../utils/otp.utils";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyVerificationToken,
} from "../utils/token.utils";

import { sendEmailVerificationSuccess } from "#integrations/email/email.service.js";

interface VerifyEmailInput {
  otp: string;
  verificationToken: string;
  userAgent: string;
  ipAddress: string;
}

export const verifyEmailService = async ({
  otp,
  verificationToken,
  userAgent,
  ipAddress,
}: VerifyEmailInput) => {
  // Verify the email verification token
  const { tokenId, purpose } = verifyVerificationToken(verificationToken);

  if (purpose !== VerificationTokenPurpose.EMAIL_VERIFICATION) {
    throw new ApiError(400, "Invalid verification token!");
  }

  // Find the pending user
  const unverifiedUser = await UnverifiedUserModel.findById(tokenId);

  if (!unverifiedUser) {
    throw new ApiError(400, "Unverified user not found!");
  }

  // Verify OTP
  const isOtpValid = await compareOTP(otp, unverifiedUser.otpHash);

  if (!isOtpValid) {
    throw new ApiError(400, "Invalid OTP!");
  }

  // Create the verified user
  const { name, email, username, passwordHash } = unverifiedUser;

  const user = await UserModel.create({
    name,
    email,
    username,
    passwordHash,
  });

  // Create a session for the newly verified user
  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
    ipAddress,
  });

  // Generate authentication tokens
  const accessToken = generateAccessToken(user._id.toString());

  const refreshToken = generateRefreshToken(
    user._id.toString(),
    session._id.toString()
  );

  // Store only the hashed refresh token
  session.refreshTokenHash = hashRefreshToken(refreshToken);
  await session.save();

  // Notify the user
  await sendEmailVerificationSuccess(user.email, user.name ?? "");

  // Remove sensitive fields before returning the user
  const userObject = user.toObject();
  const { passwordHash: _, ...safeUser } = userObject;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};
