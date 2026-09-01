import type { CookieOptions } from "express";

/**
 * Shared base options for every auth-related cookie.
 * `strict` sameSite + `secure` + `httpOnly` blocks CSRF, XSS token
 * theft, and cross-site leakage in one shot.
 */
const baseAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 150 * 1000,
  path: "/",
};

export const verificationCookieOptions: CookieOptions = {
  ...baseAuthCookieOptions,
};

export const refreshCookieOptions: CookieOptions = {
  ...baseAuthCookieOptions,
};
