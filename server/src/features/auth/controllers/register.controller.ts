import asyncHandler from "#core/utils/asyncHandler.js";
import type { Request, Response } from "express";

import { registerService } from "../services/register.service.js";
import { verificationTokenCookieConfig } from "../config/cookie.config.js";
import ApiResponse from "#core/utils/ApiResponse.js";

/**
 * Initiates registration and returns a verification token via cookie.
 */
export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, username, password } = req.body;

    const { verificationToken } = await registerService({
      name,
      email,
      username,
      password,
    });

    res.cookie(
      "verificationToken",
      verificationToken,
      verificationTokenCookieConfig
    );

    const response = new ApiResponse(
      201,
      null,
      "Registration initiated successfully. OTP sent for verification."
    );

    res.status(response.statusCode).json(response);
  }
);
