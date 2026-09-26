import ApiResponse from "#core/utils/ApiResponse.ts";
import asyncHandler from "#core/utils/asyncHandler.ts";
import { Request, Response } from "express";
import UserModel from "../models/user.model";
import ApiError from "#core/errors/ApiError.ts";

export const userController = asyncHandler(
  async (req: Request, res: Response) => {
    const username = req.params;
    console.log(username);

    const user = await UserModel.findOne(username);

    if (!user) throw new ApiError(404, "User not found!");

    const response = new ApiResponse(
      200,
      { user },
      "User fetched successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
