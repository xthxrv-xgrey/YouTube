import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { loginService } from "../services/login.service.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import { refreshCookieOptions } from "../config/auth.cookie.js";

/**
 * POST /auth/login
 * @access  Public
 * @body    { identifier, password } — pre-validated by `validateLogin`
 * @cookie  Sets `refreshToken` to start a new session
 * @returns 200 { user, accessToken }
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginService({
    identifier: req.body.identifier,
    password: req.body.password,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200,
    { user, accessToken },
    "Login successful"
  );

  res.status(response.statusCode).json(response);
});
