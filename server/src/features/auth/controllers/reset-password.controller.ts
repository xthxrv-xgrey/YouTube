import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { resetPasswordService } from "../services/reset-password.service.js";
import {
  refreshCookieOptions,
  verificationCookieOptions,
} from "../config/auth.cookie.js";
import ApiResponse from "#core/utils/ApiResponse.js";

/**
 * POST /auth/reset-password
 * @access  Public (requires the `verificationToken` cookie from /auth/forgot-password)
 * @body    { otp, newPassword } — pre-validated by `validateResetPassword`
 * @cookie  Clears `verificationToken`, sets `refreshToken` to start a fresh session
 * @returns 200 { user, accessToken } — all other sessions are revoked server-side
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await resetPasswordService({
      verificationToken: req.cookies?.verificationToken,
      otp: req.body.otp,
      newPassword: req.body.newPassword,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.clearCookie("verificationToken", verificationCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    const response = new ApiResponse(
      200,
      { user, accessToken },
      "Password reset successfully"
    );

    res.status(response.statusCode).json(response);
  }
);
