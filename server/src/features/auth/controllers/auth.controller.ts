import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.js";

import {
  loginUser,
  logoutUser,
  logoutUserFromAllDevices,
  refreshTokens,
  registerUser,
  verifyUserEmail,
} from "#features/auth/services/auth.service.js";

import {
  verificationCookieOptions,
  refreshCookieOptions,
} from "#features/auth/config/auth.cookie.js";

/**
 * POST /auth/register
 * Starts registration; issues a short-lived verification cookie.
 */
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

/**
 * POST /auth/verify-email
 * Confirms the OTP, promotes the pending user to a real account,
 * and starts a session.
 */
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

/**
 * POST /auth/login
 * Authenticates a user and starts a new session.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginUser({
    identifier: req.body.identifier,
    password: req.body.password,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200, // fixed: login doesn't create a resource, so this isn't a 201
    { user, accessToken },
    "Login successful"
  );

  res.status(response.statusCode).json(response);
});

/**
 * POST /auth/logout
 * Ends the current session only.
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.session) {
    res.status(401).json({ message: "Session not found" });
    return;
  }

  await logoutUser({ sessionId: req.session._id.toString() });

  res.clearCookie("refreshToken", refreshCookieOptions);

  const response = new ApiResponse(200, {}, "Logged out successfully");
  res.status(response.statusCode).json(response);
});

/**
 * POST /auth/logout-all-devices
 * Ends every session belonging to the authenticated user.
 */
export const logoutAllDevices = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    await logoutUserFromAllDevices({ userId: req.user._id.toString() });

    res.clearCookie("refreshToken", refreshCookieOptions);

    const response = new ApiResponse(
      200,
      {},
      "Logged out of all devices successfully"
    );
    res.status(response.statusCode).json(response);
  }
);

/**
 * POST /auth/refresh
 * Rotates the access/refresh token pair for a session. If the
 * refresh token turns out to be a stale, already-rotated one,
 * the service layer treats that as reuse and logs the user out
 * everywhere — this endpoint just surfaces whatever error results.
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  const { accessToken, refreshToken } = await refreshTokens(oldRefreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200,
    { accessToken },
    "Access token refreshed successfully"
  );
  res.status(response.statusCode).json(response);
});
