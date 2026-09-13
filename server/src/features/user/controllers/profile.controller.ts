import ApiResponse from "#core/utils/ApiResponse.js";
import { Request, Response } from "express";

export const profileController = (req: Request, res: Response) => {
  const user = req.user;

  const response = new ApiResponse(200, { user });

  return res.status(200).json(response);
};
