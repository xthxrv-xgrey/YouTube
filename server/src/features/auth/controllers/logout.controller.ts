import ApiResponse from "#core/utils/ApiResponse.ts";
import asyncHandler from "#core/utils/asyncHandler.ts";
import { Request, Response } from "express";
import { logoutUser } from "../services/logout.service";

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken");

    const response = new ApiResponse(200, {}, "Logout refreshed successfully!");

    res.status(response.statusCode).json(response);
  }
);
