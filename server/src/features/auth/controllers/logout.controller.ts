import { Request, Response } from "express";
import asyncHandler from "#core/utils/asyncHandler.js";
import ApiError from "#core/errors/ApiError.js";
import SessionModel from "../models/session.model.js";
import ApiResponse from "#core/utils/ApiResponse.js";

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const session = req.session;

    if (!session) {
      throw new ApiError(401, "Unauthorized.");
    }

    await SessionModel.findByIdAndDelete(session._id);

    res.clearCookie("refreshToken");

    const response = new ApiResponse(200, null, "Logout successful!");

    res.status(response.statusCode).json(response);
  }
);
