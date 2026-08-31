import ApiError from "#core/errors/ApiError.js";
import { UserModel } from "#features/user/user.model.js";
import { sendPasswordResetOTP } from "#integrations/email/email.service.js";
import { generateOTP, hashOTP } from "#utils/otp.utils.js";
import { generateVerificationToken } from "#utils/token.utils.js";
import { PasswordResetModel } from "../models/password-reset.model.js";
import { getVerificationExpirty } from "../utils/auth.utils.js";

/**
 * Initiates a password reset. Returns a null token when no account
 * matches the identifier so the controller can avoid leaking account
 * existence via the cookie.
 */
export const forgotPasswordService = async (identifier: string) => {
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return { verificationToken: null };
  }

  const pendingPasswordResetReqest = await PasswordResetModel.findOne({
    userId: user._id,
  });

  console.log(pendingPasswordResetReqest);
  if (pendingPasswordResetReqest)
    throw new ApiError(
      400,
      "Password Request pending please try after few mins"
    );

  const otp = generateOTP();
  const hashedOTP = await hashOTP(otp);

  if (!(await sendPasswordResetOTP(user.email, otp))) {
    throw new ApiError(
      400,
      "Unable to send the verification email. Please try again later."
    );
  }

  const passwordReset = await PasswordResetModel.create({
    userId: user._id,
    otpHash: hashedOTP,
    expiresAt: getVerificationExpirty(),
  });

  const verificationToken = generateVerificationToken(
    passwordReset._id.toString(),
    "password_reset"
  );

  return { verificationToken };
};
