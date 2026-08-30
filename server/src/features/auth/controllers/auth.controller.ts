import type { Request, Response } from "express";

import { registerUser, verifyUserEmail } from "../services/auth.service.js";

import {
  verificationCookieOptions,
  refreshCookieOptions,
} from "../config/auth.cookie.js";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { pendingUser, verificationToken } = await registerUser(req.body);

  res.cookie("verificationToken", verificationToken, verificationCookieOptions);

  const response = new ApiResponse(
    201,
    {
      id: pendingUser._id,
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      username: pendingUser.username,
      email: pendingUser.email,
    },
    "User registered successfully"
  );

  res.status(response.statusCode).json(response);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { user, refreshToken } = await verifyUserEmail({
    otp: req.body.otp,
    verificationToken: req.cookies?.verificationToken,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.clearCookie("verificationToken", verificationCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200,
    { user },
    "Email verified successfully"
  );

  res.status(response.statusCode).json(response);
});
