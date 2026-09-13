import {
  verifyVerificationToken,
  VerificationTokenPurpose,
} from "#features/auth/utils/token.utils.js";
import UnverifiedUserModel from "#features/auth/models/unverified-user.model.js";
import ApiError from "#core/errors/ApiError.ts";
import { compareOTP } from "#features/auth/utils/otp.utils.js";
import UserModel from "#features/users/models/user.model.ts";
import { sendEmailVerificationSuccess } from "#integrations/email/email.service.ts";
import { OTP_ATTEMPT_LIMIT } from "#constants/auth.ts";

interface VerifyUserInput {
  verificationToken: string;
  otp: string;
}

export const verifyUser = async (input: VerifyUserInput) => {
  const { verificationToken, otp } = input;

  const { tokenId, purpose } = verifyVerificationToken(verificationToken);

  if (purpose !== VerificationTokenPurpose.EMAIL_VERIFICATION) {
    throw new ApiError(401, "Invalid verification token.");
  }

  const unverifiedUser = await UnverifiedUserModel.findById(tokenId);

  if (!unverifiedUser) {
    throw new ApiError(401, "Verification request is invalid or has expired.");
  }

  const isOtpValid = await compareOTP(otp, unverifiedUser.otpHash);

  if (!isOtpValid) {
    const newAttempts = unverifiedUser.attempts + 1;

    if (newAttempts >= OTP_ATTEMPT_LIMIT) {
      await UnverifiedUserModel.findByIdAndDelete(tokenId);

      throw new ApiError(
        429,
        "Too many incorrect OTP attempts. Please request a new verification code."
      );
    }

    await UnverifiedUserModel.findByIdAndUpdate(tokenId, {
      attempts: newAttempts,
    });

    const remainingAttempts = OTP_ATTEMPT_LIMIT - newAttempts;

    throw new ApiError(
      401,
      `Invalid verification code. ${remainingAttempts} attempt${
        remainingAttempts === 1 ? "" : "s"
      } remaining.`
    );
  }

  const { otpHash: _, ...userData } = unverifiedUser.toObject();

  const user = await UserModel.create(userData);

  await UnverifiedUserModel.findByIdAndDelete(tokenId);

  await sendEmailVerificationSuccess(user.email, user.name ?? "User");

  const { passwordHash: __, ...safeUser } = user.toObject();

  return { safeUser };
};
