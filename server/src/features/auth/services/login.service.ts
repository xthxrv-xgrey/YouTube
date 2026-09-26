import ApiError from "#core/errors/ApiError.js";
import UserModel from "#features/user/models/user.model.js";
import { sendNewLoginEmail } from "#integrations/email/email.service.js";
import { verifPassword } from "../utils/password.util.js";
import { createSession } from "../utils/session.util.js";

interface LoginInput {
  identifier: string;
  password: string;
  userAgent: string;
  ipAddress: string;
}

export const loginService = async ({
  identifier,
  password,
  userAgent,
  ipAddress,
}: LoginInput) => {
  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+passwordHash");

  if (!user) throw new ApiError(401, "Invalid credentials!");

  const validPassword = await verifPassword(password, user.passwordHash);

  if (!validPassword) throw new ApiError(401, "Invalid credentials!");

  const { accessToken, refreshToken } = await createSession({
    userId: user._id.toString(),
    userAgent,
    ipAddress,
  });

  // Notify the user
  await sendNewLoginEmail(user.email, user.name ?? "");

  const userObject = user.toObject();
  const { passwordHash: _, ...safeUser } = userObject;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};
