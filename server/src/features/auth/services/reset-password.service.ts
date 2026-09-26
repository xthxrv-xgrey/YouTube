import { OTP_ATTEMPT_LIMIT } from "#constants/auth.ts";
import ApiError from "#core/errors/ApiError.ts";
import UserModel from "#features/user/models/user.model.ts";
import { sendPasswordResetSuccess } from "#integrations/email/email.service.ts";

import ResetPasswordModel from "../models/reset-password.model.ts";
import { VerificationTokenPurpose } from "../types/token-payload.types.ts";
import { compareOTP } from "../utils/otp.utils.ts";
import { hashPassword } from "../utils/password.util.ts";
import { verifyVerificationToken } from "../utils/token.utils.ts";

interface ResetPasswordInput {
  otp: string;
  newPassword: string;
  verificationToken: string;
}

export const resetPasswordService = async ({
  otp,
  newPassword,
  verificationToken,
}: ResetPasswordInput) => {
  // Verify the reset token
  const { tokenId, purpose } = verifyVerificationToken(verificationToken);

  if (purpose !== VerificationTokenPurpose.FORGOT_PASSWORD) {
    throw new ApiError(400, "Invalid verification token!");
  }

  // Find the reset request
  const resetPassword = await ResetPasswordModel.findById(tokenId);

  if (!resetPassword) {
    throw new ApiError(400, "Reset request not found!");
  }

  // Reject verification once the attempt limit is reached
  if (resetPassword.attempts >= OTP_ATTEMPT_LIMIT) {
    await ResetPasswordModel.findByIdAndDelete(resetPassword._id);

    throw new ApiError(
      429,
      "Too many invalid OTP attempts. Please request a new OTP."
    );
  }

  // Verify OTP
  const isOtpValid = await compareOTP(otp, resetPassword.otpHash);

  if (!isOtpValid) {
    const updatedResetPassword = await ResetPasswordModel.findByIdAndUpdate(
      resetPassword._id,
      { $inc: { attempts: 1 } },
      { returnDocument: "after" }
    );

    if (!updatedResetPassword) {
      throw new ApiError(404, "Reset request not found");
    }

    // Delete the reset request once the limit is reached
    if (updatedResetPassword.attempts >= OTP_ATTEMPT_LIMIT) {
      await ResetPasswordModel.findByIdAndDelete(resetPassword._id);

      throw new ApiError(
        429,
        "Too many invalid OTP attempts. Please request a new OTP."
      );
    }

    throw new ApiError(400, "Invalid OTP!");
  }

  // Hash the new password
  const passwordHash = await hashPassword(newPassword);

  // Update the user's password
  const user = await UserModel.findByIdAndUpdate(
    resetPassword.userId,
    { $set: { passwordHash } },
    { returnDocument: "after" }
  );

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  // Consume the reset request so the OTP cannot be reused
  await ResetPasswordModel.findByIdAndDelete(resetPassword._id);

  await sendPasswordResetSuccess(user.email, user.name ?? "");

  return {
    message: "Password reset successfully!",
  };
};
