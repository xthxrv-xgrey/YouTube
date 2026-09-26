import ApiError from "#core/errors/ApiError.ts";

import SessionModel from "../models/session.model.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
} from "../utils/token.utils.ts";

interface RefreshInput {
  refreshToken: string;
}

export const refreshService = async ({ refreshToken }: RefreshInput) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  const session = await SessionModel.findById(payload.sessionId);

  if (!session) {
    throw new ApiError(401, "Session expired or invalid.");
  }

  const incomingRefreshTokenHash = hashRefreshToken(refreshToken);

  if (incomingRefreshTokenHash !== session.refreshTokenHash) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  const accessToken = generateAccessToken(
    session.userId.toString(),
    session._id.toString()
  );

  const newRefreshToken = generateRefreshToken(
    session.userId.toString(),
    session._id.toString()
  );

  session.refreshTokenHash = hashRefreshToken(newRefreshToken);

  await session.save();

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
