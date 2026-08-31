import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { refreshService } from "../services/refresh.service.js";
import { refreshCookieOptions } from "../config/auth.cookie.js";
import ApiResponse from "#core/utils/ApiResponse.js";

/**
 * POST /auth/refresh
 * @access  Public (requires the `refreshToken` cookie; presence is pre-checked by `validateRefresh`)
 * @cookie  Rotates `refreshToken`
 * @returns 200 { accessToken }
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  const { accessToken, refreshToken } = await refreshService(oldRefreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200,
    { accessToken },
    "Access token refreshed successfully"
  );

  res.status(response.statusCode).json(response);
});
