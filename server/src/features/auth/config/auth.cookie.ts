import type { CookieOptions } from "express";

export const verificationCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};
