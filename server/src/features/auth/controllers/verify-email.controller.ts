import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.js";

import { verifyEmailService } from "../services/verify-email.service.js";
import { refreshTokenCookieConfig } from "../config/cookie.config.js";

/**
 * Completes email verification and creates the user's account.
 */
export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp } = req.body;
    const verificationToken = req.cookies.verificationToken;

    const { user, accessToken, refreshToken } = await verifyEmailService({
      otp,
      verificationToken,
      userAgent: req.get("user-agent") ?? "",
      ipAddress: req.ip ?? "",
    });

    res.clearCookie("verificationToken");
    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    const response = new ApiResponse(
      201,
      { user, accessToken },
      "Account created successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
