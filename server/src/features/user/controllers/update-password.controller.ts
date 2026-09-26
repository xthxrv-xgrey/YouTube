import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiError from "#core/errors/ApiError.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import UserModel from "../models/user.model.js";

import {
  hashPassword,
  verifPassword,
} from "#features/auth/utils/password.util.js";

export const updatePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    const userWithPasswordHash = await UserModel.findById(user._id).select(
      "+passwordHash"
    );

    if (!userWithPasswordHash) {
      throw new ApiError(404, "User not found");
    }

    const validPassword = await verifPassword(
      oldPassword,
      userWithPasswordHash.passwordHash
    );

    if (!validPassword) {
      throw new ApiError(401, "Current password is incorrect");
    }

    const newPasswordHash = await hashPassword(newPassword);

    await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          passwordHash: newPasswordHash,
        },
      },
      { returnDocument: "after" }
    );

    const response = new ApiResponse(
      200,
      null,
      "Password updated successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
