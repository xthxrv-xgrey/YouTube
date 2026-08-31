import ApiError from "#core/errors/ApiError.js";
import { UserModel } from "#features/user/user.model.js";
import { LoginInput } from "../types/auth.types.js";
import { createSessionAndTokens } from "../utils/auth.utils.js";
import { comparePassword } from "../utils/password.utils.js";

/**
 * Authenticates a user and starts a new session.
 */
export const loginService = async (data: LoginInput) => {
  const { identifier, password, ip, userAgent } = data;

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password.");
  }

  const { accessToken, refreshToken } = await createSessionAndTokens(
    user._id.toString(),
    ip,
    userAgent
  );

  const safeUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};
