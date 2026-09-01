import jwt from "jsonwebtoken";

import env from "#config/env.js";
import { OTP_ATTEMPT_LIMIT } from "#constants/auth.js";
import ApiError from "#core/errors/ApiError.js";
import { UserModel } from "#features/user/user.model.js";
import { sendEmailVerificationSuccess } from "#integrations/email/email.service.js";
import { compareOTP } from "#utils/otp.utils.js";

import { PendingUserModel } from "../models/pending-user.model.js";
import { VerifyEmailInput } from "../types/auth.types.js";
import { VerificationTokenPayload } from "../types/token-payload.types.js";
import { createSessionAndTokens } from "../utils/auth.utils.js";

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

  const pendingUser = await PendingUserModel.findById(payload.tokenId);

  if (!pendingUser) {
    throw new ApiError(
      400,
      "Your account creation request has expired. Please start the registration process again."
    );
  }

  if (pendingUser.attempts >= OTP_ATTEMPT_LIMIT) {
    await PendingUserModel.findByIdAndDelete(pendingUser._id);

    throw new ApiError(
      429,
      "Too many incorrect attempts. Please start the registration process again."
    );
  }

  const isOTPValid = await compareOTP(otp, pendingUser.otpHash);

  if (!isOTPValid) {
    await PendingUserModel.findByIdAndUpdate(pendingUser._id, {
      $inc: { attempts: 1 },
    });

    throw new ApiError(400, "Invalid OTP. Please enter the correct OTP.");
  }

  await PendingUserModel.findByIdAndDelete(pendingUser._id);

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

  const safeUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };

  await sendEmailVerificationSuccess(user.email, user.firstName);

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};
