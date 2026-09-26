import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiError from "#core/errors/ApiError.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import UserModel from "../models/user.model.js";

export const updateUsernameController = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.body;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const existingUsername = await UserModel.findOne({
      username,
      _id: { $ne: user._id },
    });

    if (existingUsername) {
      throw new ApiError(409, "Username is already taken");
    }

    await UserModel.findByIdAndUpdate(
      user._id,
      { $set: { username } },
      { returnDocument: "after" }
    );

    const response = new ApiResponse(
      200,
      null,
      "Username updated successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
