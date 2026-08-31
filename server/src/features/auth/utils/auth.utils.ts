import {
  MS_PER_DAY,
  SESSION_TTL_DAYS,
  VERIFICATION_TTL,
} from "#constants/auth.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "#utils/token.utils.js";
import { SessionModel } from "#features/auth/models/session.model.js";

export const getSessionExpiry = () =>
  new Date(Date.now() + SESSION_TTL_DAYS * MS_PER_DAY);

export const getVerificationExpirty = () =>
  new Date(Date.now() + VERIFICATION_TTL * 1000);

/**
 * Creates a session and a matching access/refresh token pair.
 * The session is created first (with a placeholder hash) so the
 * session ID can be embedded in the refresh token itself — that's
 * what lets `refreshTokens` detect reuse later.
 */
export const createSessionAndTokens = async (
  userId: string,
  ip: string | undefined,
  userAgent: string | undefined
) => {
  const session = await SessionModel.create({
    userId,
    ip,
    userAgent,
    refreshTokenHash: "pending", // overwritten immediately below
    expiresAt: getSessionExpiry(),
  });

  const sessionId = session._id.toString();
  const refreshToken = generateRefreshToken(userId, sessionId);
  const accessToken = generateAccessToken(userId, sessionId);

  session.refreshTokenHash = hashRefreshToken(refreshToken);
  await session.save();

  return { accessToken, refreshToken };
};
