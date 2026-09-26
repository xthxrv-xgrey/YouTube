import asyncHandler from "#core/utils/asyncHandler.js";
import ApiError from "#core/errors/ApiError.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import { Request, Response } from "express";
import SessionModel from "../models/session.model.js";

export const logoutAllController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized.");
    }

    await SessionModel.deleteMany({
      userId: req.user._id,
    });

    res.clearCookie("refreshToken");

    const response = new ApiResponse(
      200,
      null,
      "Logged out from all devices successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
