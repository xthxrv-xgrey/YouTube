import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { forgotPasswordService } from "../services/forgot-password.service.js";
import { verificationCookieOptions } from "../config/auth.cookie.js";
import ApiResponse from "#core/utils/ApiResponse.js";

/**
 * POST /auth/forgot-password
 * @access  Public
 * @body    { identifier } — pre-validated by `validateForgotPassword`
 * @cookie  Sets `verificationToken` only when a reset session was actually
 *          created — setting it unconditionally (even to "null") would leak
 *          whether the account exists via the cookie's presence/value.
 * @returns 200 {} — always the same message, regardless of whether the
 *          identifier matched a user, to avoid leaking account existence
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier } = req.body;
    const { verificationToken } = await forgotPasswordService(identifier);

    if (verificationToken) {
      res.cookie(
        "verificationToken",
        verificationToken,
        verificationCookieOptions
      );
    }

    const response = new ApiResponse(
      200,
      {},
      "If an account with that identifier exists, a password reset code has been sent."
    );

    res.status(response.statusCode).json(response);
  }
);
