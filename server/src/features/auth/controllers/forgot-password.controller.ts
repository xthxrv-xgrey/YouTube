import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.js";

import { forgotPasswordService } from "../services/forgot-password.service.js";
import { verificationTokenCookieConfig } from "../config/cookie.config.js";

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier } = req.body;

    const { verificationToken } = await forgotPasswordService({
      identifier,
    });

    res.cookie(
      "verificationToken",
      verificationToken,
      verificationTokenCookieConfig
    );

    const response = new ApiResponse(
      200,
      null,
      "Password reset OTP sent successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
