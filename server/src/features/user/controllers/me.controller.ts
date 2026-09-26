import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.ts";
import { Request, Response } from "express";

export const meController = (req: Request, res: Response) => {
  const user = req.user;
  const response = new ApiResponse(200, { user }, "User fetched successfully!");

  res.status(response.statusCode).json(response);
};
