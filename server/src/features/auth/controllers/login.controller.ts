import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { loginUser } from "#features/auth/services/login.service.js";
import { createSession } from "#features/auth/utils/session.util.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import { refreshTokenCookieConfig } from "#features/auth/config/cookie.config.js";

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    const { safeUser } = await loginUser({
      identifier,
      password,
    });

    const {
      session: _,
      accessToken,
      refreshToken,
    } = await createSession({
      userId: safeUser._id.toString(),
      userAgent: req.get("User-Agent"),
      ipAddress: req.ip,
    });

    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    const response = new ApiResponse(
      201,
      { user: safeUser, accessToken },
      "Login successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
