import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.js";

import {
  loginUser,
  logoutUser,
  logoutUserFromAllDevices,
  registerUser,
  verifyUserEmail,
} from "#features/auth/services/auth.service.js";

import {
  verificationCookieOptions,
  refreshCookieOptions,
} from "#features/auth/config/auth.cookie.js";

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
  const { user, accessToken, refreshToken } = await verifyUserEmail({
    otp: req.body.otp,
    verificationToken: req.cookies?.verificationToken,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.clearCookie("verificationToken", verificationCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200,
    { user, accessToken },
    "Email verified successfully"
  );

  res.status(response.statusCode).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginUser({
    identifier: req.body.identifier,
    password: req.body.password,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    201,
    {
      user,
      accessToken,
    },
    "User Loggined successfully"
  );

  res.status(response.statusCode).json(response);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.session) {
    res.status(401).json({ message: "Session not found" });
    return;
  }

  await logoutUser({
    sessionId: req.session._id.toString(),
  });

  const response = new ApiResponse(200, {}, "User logged out successfully");

  res.status(response.statusCode).json(response);
});

export const logoutAllDevices = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    await logoutUserFromAllDevices({
      userId: req.user._id.toString(),
    });

    const response = new ApiResponse(
      200,
      {},
      "All Devices logged out successfully"
    );

    res.status(response.statusCode).json(response);
  }
);
