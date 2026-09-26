import { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.ts";
import ApiError from "#core/errors/ApiError.ts";
import ApiResponse from "#core/utils/ApiResponse.ts";

import { refreshService } from "../services/refresh.service.ts";
import { refreshTokenCookieConfig } from "../config/cookie.config.ts";

export const refreshController = asyncHandler(
  async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      throw new ApiError(401, "Unauthorized.");
    }

    const { accessToken, refreshToken } = await refreshService({
      refreshToken: oldRefreshToken,
    });

    res.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

    const response = new ApiResponse(
      200,
      { accessToken },
      "Tokens refreshed successfully"
    );

    res.status(response.statusCode).json(response);
  }
);
