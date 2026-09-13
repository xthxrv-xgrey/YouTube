import { Request, Response } from "express";
import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.ts";
import { getChannel } from "../services/get-channel.service";

export const getChannelController = asyncHandler(
  async (req: Request, res: Response) => {
    const { channelHandle } = req.params;

    if (typeof channelHandle !== "string") {
      throw new Error("Invalid channel Handle");
    }

    const channel = await getChannel(channelHandle);

    const response = new ApiResponse(
      200,
      { channel },
      "Channel Found successfully!"
    );

    res.status(response.statusCode).json(response);
  }
);
