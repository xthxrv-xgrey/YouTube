import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { verifyEmailService } from "../services/verify.service.js";
import {
  refreshCookieOptions,
  verificationCookieOptions,
} from "../config/auth.cookie.js";
import ApiResponse from "#core/utils/ApiResponse.js";

/**
 * POST /auth/verify-email
 * @access  Public (requires the `verificationToken` cookie from /auth/register)
 * @body    { otp } — pre-validated by `validateEmailVerification`
 * @cookie  Clears `verificationToken`, sets `refreshToken` to start the session
 * @returns 200 { user, accessToken }
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await verifyEmailService({
    otp: req.body.otp,
    verificationToken: req.cookies?.verificationToken,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.clearCookie("verificationToken", verificationCookieOptions);
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200,
    { user, accessToken },
    "Email verified successfully"
  );

  res.status(response.statusCode).json(response);
});
