import ApiError from "#core/errors/ApiError.js";
import UserModel from "#features/user/models/user.model.js";
import { sendPasswordResetOTP } from "#integrations/email/email.service.js";

import ResetPasswordModel from "../models/reset-password.model.js";
import { VerificationTokenPurpose } from "../types/token-payload.types.js";
import { generateOTP, hashOTP } from "../utils/otp.utils.js";
import { generateVerificationToken } from "../utils/token.utils.js";

interface ForgotPasswordInput {
  identifier: string;
}

export const forgotPasswordService = async ({
  identifier,
}: ForgotPasswordInput) => {
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  // Do not reveal whether the account exists.
  if (!user) {
    return {
      message: "If an account exists, a password reset OTP has been sent.",
    };
  }

  // Invalidate any previous reset request for this user.
  await ResetPasswordModel.deleteMany({
    userId: user._id,
  });

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);

  const resetPassword = await ResetPasswordModel.create({
    userId: user._id,
    otpHash,
    attempts: 0,
  });

  const verificationToken = generateVerificationToken(
    resetPassword._id.toString(),
    VerificationTokenPurpose.FORGOT_PASSWORD
  );

  const emailSent = await sendPasswordResetOTP(user.email, otp);

  if (!emailSent) {
    await ResetPasswordModel.findByIdAndDelete(resetPassword._id);

    throw new ApiError(500, "Unable to send password reset email");
  }

  return {
    verificationToken,
  };
};
