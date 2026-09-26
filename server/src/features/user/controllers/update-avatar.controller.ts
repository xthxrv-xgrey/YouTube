import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiError from "#core/errors/ApiError.js";
import ApiResponse from "#core/utils/ApiResponse.js";
import { uploadImage } from "#integrations/media/image.provider.js";
import UserModel from "../models/user.model.js";

export const updateAvatarController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!req.file) {
      throw new ApiError(400, "Avatar image is required");
    }

    const result = await uploadImage({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/youtube/avatar",
    });

    console.log(result);

    await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          avatarUrl: result.url,
        },
      },
      { returnDocument: "after" }
    );

    const response = new ApiResponse(
      200,
      {
        avatar: result.url,
      },
      "Avatar updated successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
