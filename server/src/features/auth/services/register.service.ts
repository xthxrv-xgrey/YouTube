import ApiError from "#core/errors/ApiError.js";
import { UserModel } from "#features/user/user.model.js";
import { sendEmailVerificationOTP } from "#integrations/email/email.service.js";
import { generateOTP, hashOTP } from "#utils/otp.utils.js";
import { generateVerificationToken } from "#utils/token.utils.js";
import { PendingUserModel } from "../models/pending-user.model.js";
import { RegisterInput } from "../types/auth.types.js";
import { getVerificationExpirty } from "../utils/auth.utils.js";
import { hashPassword } from "../utils/password.utils.js";

/**
 * Registers a new user as a pending registration.
 */
export const registerService = async (data: RegisterInput) => {
  const { firstName, lastName, username, email, password } = data;

  const existingUserByEmail = await UserModel.findOne({ email });
  if (existingUserByEmail) {
    throw new ApiError(409, "Email already exists.");
  }

  const existingUserByUsername = await UserModel.findOne({ username });
  if (existingUserByUsername) {
    throw new ApiError(409, "Username already exists.");
  }

  const pendingUserByEmail = await PendingUserModel.findOne({ email });
  if (pendingUserByEmail) {
    throw new ApiError(
      409,
      "Email verification is pending. Please try again in a few minutes."
    );
  }

  const pendingUserByUsername = await PendingUserModel.findOne({ username });
  if (pendingUserByUsername) {
    throw new ApiError(
      409,
      "Username verification is pending. Please try again in a few minutes."
    );
  }

  const hashedPassword = await hashPassword(password);

  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  if (!(await sendEmailVerificationOTP(email, otp))) {
    throw new ApiError(
      400,
      "Unable to send the verification email. Please try again later."
    );
  }

  const pendingUser = await PendingUserModel.create({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    otpHash: hashedOTP,
    expiresAt: getVerificationExpirty(),
  });

  const verificationToken = generateVerificationToken(
    pendingUser._id.toString()
  );

  return {
    pendingUser,
    verificationToken,
  };
};
