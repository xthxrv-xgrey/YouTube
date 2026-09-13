import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import type { Request, Response } from "express";
import { verifyUser } from "#features/auth/services/verify-user.service.js";
import { createSession } from "#features/auth/utils/session.util.js";
import { refreshTokenCookieConfig } from "#features/auth/config/cookie.config.js";

export const verifyUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { verificationToken } = req.cookies;  
    const { otp } = req.body;

    const { safeUser } = await verifyUser({ verificationToken, otp });

    const {
      session: _,
      accessToken,
      refreshToken,
    } = await createSession({
      userId: safeUser._id.toString(),
      userAgent: req.get("User-Agent"),
      ipAddress: req.ip,
    });

    res.clearCookie("verificationToken");
    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    const response = new ApiResponse(
      201,
      { user: safeUser, accessToken },
      "Account created successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
