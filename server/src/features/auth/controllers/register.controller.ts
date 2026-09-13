import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import type { Request, Response } from "express";
import { registerUser } from "#features/auth/services/register.service.js";
import { verificationTokenCookieConfig } from "#features/auth/config/cookie.config.js";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, username, password } = req.body;

    const { safeUser, verificationToken } = await registerUser({
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
      { user: safeUser },
      "Account created successfully! Please verify the OTP sent to your email to complete your registration."
    );

    res.status(response.statusCode).json(response);
  }
);
