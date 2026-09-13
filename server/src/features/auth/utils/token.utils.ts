import { createHash } from "node:crypto";
import jwt from "jsonwebtoken";

import env from "#config/env.js";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  VerificationTokenPayload,
  VerificationTokenPurpose,
} from "#features/auth/types/token-payload.types.js";

// ============================================================================
// Verification Token
// ============================================================================

/**
 * Generates a token used for email verification or password reset.
 */
export const generateVerificationToken = (
  tokenId: string,
  purpose: VerificationTokenPurpose
): string => {
  const payload: VerificationTokenPayload = {
    tokenId,
    purpose,
  };

  return jwt.sign(payload, env.VERIFICATION_TOKEN_SECRET, {
    expiresIn: env.VERIFICATION_TOKEN_EXPIRY,
  });
};

/**
 * Verifies and decodes a verification token.
 */
export const verifyVerificationToken = (
  token: string
): VerificationTokenPayload => {
  const decoded = jwt.verify(token, env.VERIFICATION_TOKEN_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.tokenId !== "string" ||
    typeof decoded.purpose !== "string"
  ) {
    throw new Error("Invalid verification token payload");
  }

  return decoded as VerificationTokenPayload;
};

// ============================================================================
// Access Token
// ============================================================================

/**
 * Generates an access token.
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
 * Verifies and decodes an access token.
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string"
  ) {
    throw new Error("Invalid access token payload");
  }

  return decoded as AccessTokenPayload;
};

// ============================================================================
// Refresh Token
// ============================================================================

/**
 * Generates a refresh token.
 */
export const generateRefreshToken = (
  userId: string,
  sessionId: string
): string => {
  const payload: RefreshTokenPayload = {
    userId,
    sessionId,
  };

  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verifies and decodes a refresh token.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string" ||
    typeof decoded.sessionId !== "string"
  ) {
    throw new Error("Invalid refresh token payload");
  }

  return decoded as RefreshTokenPayload;
};

// ============================================================================
// Token Utilities
// ============================================================================

/**
 * Hashes a refresh token using SHA-256.
 */
export const hashRefreshToken = (refreshToken: string): string =>
  createHash("sha256").update(refreshToken).digest("hex");
