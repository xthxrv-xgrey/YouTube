import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError.js";

const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
