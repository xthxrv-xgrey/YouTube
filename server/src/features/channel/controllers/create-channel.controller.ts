import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { createChannel } from "../services/create-channel.service";
import ApiResponse from "#core/utils/ApiResponse.js";

export const createChannelController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { name, handle } = req.body;

    const channel = await createChannel({
      owner: user._id,
      handle,
      name,
    });

    const response = new ApiResponse(
      201,
      { channel },
      "Channel created successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
