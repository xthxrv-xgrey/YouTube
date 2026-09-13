import ApiError from "#core/errors/ApiError.js";
import UserModel from "#features/user/models/user.model.js";
import UnverifiedUserModel from "#features/auth/models/unverified-user.model.js";
import { hashPassword } from "#features/auth/utils/password.util.js";
import { generateOTP, hashOTP } from "#features/auth/utils/otp.utils.js";
import { sendEmailVerificationOTP } from "#integrations/email/email.service.js";
import { generateVerificationToken } from "#features/auth/utils/token.utils.js";
import { VerificationTokenPurpose } from "#features/auth/types/token-payload.types.js";

interface RegisterUserInput {
  name: string;
  email: string;
  username: string;
  password: string;
}

export const registerUser = async (input: RegisterUserInput) => {
  const { name, email, username, password } = input;

  const emailRegistered = await UserModel.findOne({ email });
  if (emailRegistered) {
    throw new ApiError(409, "This email is already registered.");
  }

  const usernameRegistered = await UserModel.findOne({ username });
  if (usernameRegistered) {
    throw new ApiError(409, "This username is already taken.");
  }

  const emailRegistrationPending = await UnverifiedUserModel.findOne({ email });
  if (emailRegistrationPending) {
    throw new ApiError(
      409,
      "A verification email has already been sent to this email address. Please check your inbox to complete your registration."
    );
  }

  const usernameRegistrationPending = await UnverifiedUserModel.findOne({
    username,
  });

  if (usernameRegistrationPending) {
    throw new ApiError(
      409,
      "This username is already associated with a pending registration. Please choose another username."
    );
  }

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);

  const mailResponse = await sendEmailVerificationOTP(email, otp);
  if (!mailResponse) {
    throw new ApiError(500, "Failed to send verification email.");
  }

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

  const {
    passwordHash: _,
    otpHash: __,
    ...safeUser
  } = unverifiedUser.toObject();

  return { safeUser, verificationToken };
};
