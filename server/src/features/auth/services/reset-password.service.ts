import jwt from "jsonwebtoken";

import env from "#config/env.js";
import { OTP_ATTEMPT_LIMIT } from "#constants/auth.js";
import ApiError from "#core/errors/ApiError.js";
import { UserModel } from "#features/user/user.model.js";
import { sendPasswordResetSuccess } from "#integrations/email/email.service.js";
import { compareOTP } from "#utils/otp.utils.js";

import { PasswordResetModel } from "../models/password-reset.model.js";
import { SessionModel } from "../models/session.model.js";
import { ResetPasswordInput } from "../types/auth.types.js";
import { VerificationTokenPayload } from "../types/token-payload.types.js";
import { createSessionAndTokens } from "../utils/auth.utils.js";
import { hashPassword } from "../utils/password.utils.js";

/**
 * Completes a password reset by verifying the OTP, updating the password,
 * revoking existing sessions, and starting a fresh session.
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

  const passwordReset = await PasswordResetModel.findById(payload.tokenId);

  if (!passwordReset) {
    throw new ApiError(400, "Password reset session expired.");
  }

  if (passwordReset.attempts >= OTP_ATTEMPT_LIMIT) {
    throw new ApiError(429, "Password reset attempt limit reached.");
  }

  const isOTPValid = await compareOTP(otp, passwordReset.otpHash);

  if (!isOTPValid) {
    await PasswordResetModel.findByIdAndUpdate(passwordReset._id, {
      $inc: { attempts: 1 },
    });

    throw new ApiError(400, "Invalid OTP.");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  const user = await UserModel.findByIdAndUpdate(
    passwordReset.userId,
    { password: hashedNewPassword },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await PasswordResetModel.findByIdAndDelete(passwordReset._id);

  // Revoke all existing sessions so previously issued tokens
  // cannot be used after the password has been changed.
  await SessionModel.deleteMany({ userId: user._id });

  const { accessToken, refreshToken } = await createSessionAndTokens(
    user._id.toString(),
    ip,
    userAgent
  );

  await sendPasswordResetSuccess(user.email, user.firstName);

  return {
    user,
    accessToken,
    refreshToken,
  };
};
