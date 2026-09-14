import asyncHandler from "#core/utils/asyncHandler.ts";
import { Request, Response } from "express";
import { refreshTokenCookieConfig } from "../config/cookie.config";
import ApiResponse from "#core/utils/ApiResponse.ts";
import { refreshTokens } from "../services/refresh.service";

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await refreshTokens(
      req.cookies.refreshToken
    );

    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    const response = new ApiResponse(
      200,
      { user, accessToken },
      "Tokens refreshed successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
