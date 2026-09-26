import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiError from "#core/errors/ApiError.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import UserModel from "../models/user.model.js";

export const updateNameController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    await UserModel.findByIdAndUpdate(
      user._id,
      { $set: { name } },
      { returnDocument: "after" }
    );

    const response = new ApiResponse(200, null, "Name updated successfully!");

    res.status(response.statusCode).json(response);
  }
);
