import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.ts";
import ApiError from "#core/errors/ApiError.ts";
import ApiResponse from "#core/utils/ApiResponse.ts";

import { resetPasswordService } from "../services/reset-password.service.ts";

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { otp, newPassword } = req.body;

    const verificationToken = req.cookies.verificationToken;

    if (!verificationToken) {
      throw new ApiError(400, "Verification token is required!");
    }

    const result = await resetPasswordService({
      otp,
      newPassword,
      verificationToken,
    });

    res.clearCookie("verificationToken");

    const response = new ApiResponse(200, null, result.message);

    res.status(response.statusCode).json(response);
  }
);
