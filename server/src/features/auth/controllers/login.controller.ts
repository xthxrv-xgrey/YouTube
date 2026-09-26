import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { refreshTokenCookieConfig } from "../config/cookie.config.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import { loginService } from "../services/login.service.js";

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    const { user, accessToken, refreshToken } = await loginService({
      identifier,
      password,
      userAgent: req.get("user-agent") ?? "",
      ipAddress: req.ip ?? "",
    });

    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    const response = new ApiResponse(
      200,
      { user, accessToken },
      "Login successful!"
    );

    res.status(response.statusCode).json(response);
  }
);
