import ApiError from "#core/errors/ApiError.js";

import UserModel from "#features/user/models/user.model.js";
import UnverifiedUserModel from "../models/unverified-user.model.js";

import { generateOTP, hashOTP } from "../utils/otp.utils.js";
import { hashPassword } from "../utils/password.util.js";
import { generateVerificationToken } from "../utils/token.utils.js";

import { VerificationTokenPurpose } from "#features/auth/types/token-payload.types.js";
import { sendEmailVerificationOTP } from "#integrations/email/email.service.js";

interface RegisterInput {
  name: string;
  email: string;
  username: string;
  password: string;
}

/**
 * Creates a temporary unverified account and sends an email OTP.
 *
 * The permanent user account is created only after OTP verification.
 */
export const registerService = async ({
  name,
  email,
  username,
  password,
}: RegisterInput) => {
  const existsEmail = await UserModel.findOne({ email });

  if (existsEmail) {
    throw new ApiError(409, "User already exists");
  }

  const existsUsername = await UserModel.findOne({ username });

  if (existsUsername) {
    throw new ApiError(409, "Username already exists");
  }

  const existsUnverifiedEmail = await UnverifiedUserModel.findOne({ email });

  if (existsUnverifiedEmail) {
    throw new ApiError(
      409,
      "Verification pending. Please verify your email first or try again later."
    );
  }

  const existsUnverifiedUsername = await UnverifiedUserModel.findOne({
    username,
  });

  if (existsUnverifiedUsername) {
    throw new ApiError(
      409,
      "Verification pending for this username. Please try again later."
    );
  }

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);
  const passwordHash = await hashPassword(password);

  const unverifiedUser = await UnverifiedUserModel.create({
    name,
    email,
    username,
    passwordHash,
    otpHash,
  });

  const verificationToken = generateVerificationToken(
    unverifiedUser._id.toString(),
    VerificationTokenPurpose.EMAIL_VERIFICATION
  );

  const emailSent = await sendEmailVerificationOTP(email, otp);

  if (!emailSent) {
    await UnverifiedUserModel.findByIdAndDelete(unverifiedUser._id);

    throw new ApiError(400, "Unable to send verification email");
  }

  return { verificationToken };
};
