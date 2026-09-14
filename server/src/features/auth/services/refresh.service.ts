import ApiError from "#core/errors/ApiError.ts";
import UserModel from "#features/user/models/user.model.ts";
import SessionModel from "../models/session.model";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
} from "../utils/token.utils";
export const refreshTokens = async (oldRefreshToken: string) => {
  if (!oldRefreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  const { userId, sessionId } = verifyRefreshToken(oldRefreshToken);

  const user = await UserModel.findById(userId);

  const session = await SessionModel.findById(sessionId);

  if (!session) {
    throw new ApiError(401, "Session not found");
  }

  const oldRefreshTokenHash = hashRefreshToken(oldRefreshToken);

  if (oldRefreshTokenHash !== session.refreshTokenHash) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId, sessionId);

  session.refreshTokenHash = hashRefreshToken(refreshToken);

  await session.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};
