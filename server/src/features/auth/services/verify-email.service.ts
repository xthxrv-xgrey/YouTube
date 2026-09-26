import ApiError from "#core/errors/ApiError.js";

import UnverifiedUserModel from "../models/unverified-user.model.js";
import UserModel from "#features/user/models/user.model.js";

import { VerificationTokenPurpose } from "../types/token-payload.types.js";
import { compareOTP } from "../utils/otp.utils.js";
import { verifyVerificationToken } from "../utils/token.utils.js";

import { sendEmailVerificationSuccess } from "#integrations/email/email.service.js";
import { createSession } from "../utils/session.util.js";

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
  const { accessToken, refreshToken } = await createSession({
    userId: user._id.toString(),
    userAgent,
    ipAddress,
  });

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
