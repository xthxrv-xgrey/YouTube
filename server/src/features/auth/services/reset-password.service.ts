import jwt from "jsonwebtoken";
import env from "#config/env.js";
import { OTP_ATTEMPT_LIMIT } from "#constants/auth.js";
import ApiError from "#core/errors/ApiError.js";
import { UserModel } from "#features/user/user.model.js";
import { compareOTP } from "#utils/otp.utils.js";
import { PasswordResetModel } from "../models/password-reset.model.js";
import { SessionModel } from "../models/session.model.js";
import { ResetPasswordInput } from "../types/auth.types.js";
import { VerificationTokenPayload } from "../types/token-payload.types.js";
import { createSessionAndTokens } from "../utils/auth.utils.js";
import { hashPassword } from "../utils/password.utils.js";
import { sendPasswordResetSuccess } from "#integrations/email/email.service.js";

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
  // Uses deleteMany directly instead of logoutAllDevicesService to
  // avoid throwing when there are zero existing sessions.
  await SessionModel.deleteMany({ userId: user._id });

  const { accessToken, refreshToken } = await createSessionAndTokens(
    user._id.toString(),
    ip,
    userAgent
  );

  await sendPasswordResetSuccess(user.email, user.firstName);

  return { user, accessToken, refreshToken };
};
