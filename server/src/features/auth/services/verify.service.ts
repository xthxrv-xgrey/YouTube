import jwt from "jsonwebtoken";
import ApiError from "#core/errors/ApiError.js";
import { VerifyEmailInput } from "../types/auth.types.js";
import { VerificationTokenPayload } from "../types/token-payload.types.js";
import { PendingUserModel } from "../models/pending-user.model.js";
import { compareOTP } from "#utils/otp.utils.js";
import { UserModel } from "#features/user/user.model.js";
import { createSessionAndTokens } from "../utils/auth.utils.js";
import env from "#config/env.js";

/**
 * Verifies a user's email address and starts a session.
 */
export const verifyEmailService = async ({
  otp,
  verificationToken,
  ip,
  userAgent,
}: VerifyEmailInput) => {
  if (!verificationToken) {
    throw new ApiError(
      400,
      "Verification session not found. Please start registration again."
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
      "Your verification session has expired. Please start registration again."
    );
  }

  if (payload.purpose !== "email_verification") {
    throw new ApiError(400, "Invalid verification session.");
  }

  const { tokenId } = payload;

  const pendingUser = await PendingUserModel.findById(tokenId);

  if (!pendingUser) {
    throw new ApiError(
      400,
      "Your account creation request has expired. Please start the registration process again."
    );
  }

  const isOTPValid = await compareOTP(otp, pendingUser.otpHash);

  if (!isOTPValid) {
    throw new ApiError(400, "Invalid OTP. Please enter the correct OTP.");
  }

  await PendingUserModel.findByIdAndDelete(tokenId);

  const user = await UserModel.create({
    firstName: pendingUser.firstName,
    lastName: pendingUser.lastName ?? "",
    username: pendingUser.username,
    email: pendingUser.email,
    password: pendingUser.password,
  });

  const { accessToken, refreshToken } = await createSessionAndTokens(
    user._id.toString(),
    ip,
    userAgent
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};
