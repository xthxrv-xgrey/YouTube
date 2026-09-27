import { OTP_ATTEMPT_LIMIT } from "#constants/auth.js";
import ApiError from "#core/errors/ApiError.js";
import UserModel from "#features/user/models/user.model.js";
import { sendPasswordResetSuccess } from "#integrations/email/email.service.js";

import ResetPasswordModel from "../models/reset-password.model.js";
import SessionModel from "../models/session.model.js";
import { VerificationTokenPurpose } from "../types/token-payload.types.js";
import { compareOTP } from "../utils/otp.utils.js";
import { hashPassword } from "../utils/password.util.js";
import { verifyVerificationToken } from "../utils/token.utils.js";

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
  await SessionModel.deleteMany({ userId: user._id });

  await sendPasswordResetSuccess(user.email, user.name ?? "");

  return {
    message: "Password reset successfully!",
  };
};
