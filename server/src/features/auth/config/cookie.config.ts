import { SESSION_TTL_DAYS, VERIFICATION_TTL } from "#constants/auth.js";
import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

/**
 * General cookie configuration
 */
export const cookieConfig: CookieOptions = {
  maxAge: 15 * 60 * 60 * 1000,
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

/**
 * Refresh token cookie configuration
 *
 * Refresh tokens normally live much longer than
 * access-token/session cookies.
 */
export const refreshTokenCookieConfig: CookieOptions = {
  maxAge: SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

export const verificationTokenCookieConfig: CookieOptions = {
  maxAge: VERIFICATION_TTL * 60 * 1000,
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};
