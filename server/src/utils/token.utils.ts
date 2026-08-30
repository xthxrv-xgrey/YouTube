import jwt from "jsonwebtoken";

import env from "#config/env.js";
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
  VerificationTokenPayload,
} from "#features/auth/types/token-payload.types.js";

/**
 * Generates a short-lived access token.
 */
export const generateAccessToken = (userId: string): string => {
  const payload: AccessTokenPayload = {
    userId,
  };

  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generates a long-lived refresh token.
 */
export const generateRefreshToken = (
  userId: string
  // sessionId: string,
): string => {
  const payload: RefreshTokenPayload = {
    userId,
    // sessionId,
  };

  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Generates a token used to verify a user's email address.
 */
export const generateVerificationToken = (pendingUserId: string): string => {
  const payload: VerificationTokenPayload = {
    pendingUserId,
    purpose: "email_verification",
  };

  return jwt.sign(payload, env.VERIFICATION_TOKEN_SECRET, {
    expiresIn: env.VERIFICATION_TOKEN_EXPIRY,
  });
};
