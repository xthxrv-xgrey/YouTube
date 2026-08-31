import jwt from "jsonwebtoken";
import ApiError from "#core/errors/ApiError.js";
import { RefreshTokenPayload } from "../types/token-payload.types.js";
import { SessionModel } from "../models/session.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "#utils/token.utils.js";
import { getSessionExpiry } from "../utils/auth.utils.js";
import env from "#config/env.js";

/**
 * Rotates the refresh token and issues a new access/refresh pair.
 */
export const refreshService = async (oldRefreshToken: string | undefined) => {
  if (!oldRefreshToken) {
    throw new ApiError(401, "No refresh token provided. Please log in again.");
  }

  let payload: RefreshTokenPayload;

  try {
    payload = jwt.verify(
      oldRefreshToken,
      env.REFRESH_TOKEN_SECRET
    ) as RefreshTokenPayload;
  } catch {
    throw new ApiError(401, "Refresh token expired. Please log in again.");
  }

  const { userId, sessionId } = payload;

  const session =
    await SessionModel.findById(sessionId).select("+refreshTokenHash");

  if (!session || session.userId.toString() !== userId) {
    throw new ApiError(401, "Session not found. Please log in again.");
  }

  const incomingTokenHash = hashRefreshToken(oldRefreshToken);

  if (incomingTokenHash !== session.refreshTokenHash) {
    await SessionModel.deleteMany({ userId });

    throw new ApiError(
      401,
      "Refresh token reuse detected. All sessions have been logged out for your safety. Please log in again."
    );
  }

  const refreshToken = generateRefreshToken(userId, sessionId);
  const accessToken = generateAccessToken(userId, sessionId);

  session.refreshTokenHash = hashRefreshToken(refreshToken);
  session.expiresAt = getSessionExpiry();

  await session.save();

  return {
    accessToken,
    refreshToken,
  };
};
