import type { Request, Response } from "express";

import asyncHandler from "#core/utils/asyncHandler.js";
import ApiResponse from "#core/utils/ApiResponse.js";

import {
  loginService,
  logoutService,
  logoutAllDevicesService,
  refreshService,
  registerService,
  verifyEmailService,
  changePasswordService,
  forgotPasswordService,
  resetPasswordService,
} from "#features/auth/services/auth.service.js";

import {
  verificationCookieOptions,
  refreshCookieOptions,
} from "#features/auth/config/auth.cookie.js";

/**
 * POST /auth/register
 * @access  Public
 * @body    { firstName, lastName?, username, email, password } — pre-validated by `validateRegister`
 * @cookie  Sets `verificationToken` (short-lived) so /auth/verify-email can complete the signup
 * @returns 201 { id, firstName, lastName, username, email }
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { pendingUser, verificationToken } = await registerService(req.body);

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
 * @access  Public (requires the `verificationToken` cookie from /auth/register)
 * @body    { otp } — pre-validated by `validateEmailVerification`
 * @cookie  Clears `verificationToken`, sets `refreshToken` to start the session
 * @returns 200 { user, accessToken }
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await verifyEmailService({
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
 * @access  Public
 * @body    { identifier, password } — pre-validated by `validateLogin`
 * @cookie  Sets `refreshToken` to start a new session
 * @returns 200 { user, accessToken }
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginService({
    identifier: req.body.identifier,
    password: req.body.password,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200,
    { user, accessToken },
    "Login successful"
  );

  res.status(response.statusCode).json(response);
});

/**
 * POST /auth/logout
 * @access  Private (requires `authMiddleware`, which attaches `req.session`)
 * @cookie  Clears `refreshToken`
 * @returns 200 {}
 *          401 if no session is attached to the request
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.session) {
    res.status(401).json({ success: false, message: "Session not found" });
    return;
  }

  await logoutService({
    sessionId: req.session._id.toString(),
  });

  res.clearCookie("refreshToken", refreshCookieOptions);

  const response = new ApiResponse(200, {}, "Logged out successfully");
  res.status(response.statusCode).json(response);
});

/**
 * POST /auth/logout-all-devices
 * @access  Private (requires `authMiddleware`, which attaches `req.user`)
 * @cookie  Clears `refreshToken`
 * @returns 200 {}
 *          401 if no user is attached to the request
 */
export const logoutAllDevices = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    await logoutAllDevicesService({
      userId: req.user._id.toString(),
    });

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
 * @access  Public (requires the `refreshToken` cookie; presence is pre-checked by `validateRefresh`)
 * @cookie  Rotates `refreshToken`
 * @returns 200 { accessToken }
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  const { accessToken, refreshToken } = await refreshService(oldRefreshToken);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const response = new ApiResponse(
    200,
    { accessToken },
    "Access token refreshed successfully"
  );

  res.status(response.statusCode).json(response);
});

/**
 * POST /auth/change-password
 * @access  Private (requires `authMiddleware`, which attaches `req.user`)
 * @body    { currentPassword, newPassword } — pre-validated by `validateChangePassword`
 * @returns 200 {}
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    await changePasswordService({
      userId: req.user!._id.toString(),
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    const response = new ApiResponse(200, {}, "Password changed successfully");

    res.status(response.statusCode).json(response);
  }
);

/**
 * POST /auth/forgot-password
 * @access  Public
 * @body    { identifier } — pre-validated by `validateForgotPassword`
 * @cookie  Sets `verificationToken` only when a reset session was actually
 *          created — setting it unconditionally (even to "null") would leak
 *          whether the account exists via the cookie's presence/value.
 * @returns 200 {} — always the same message, regardless of whether the
 *          identifier matched a user, to avoid leaking account existence
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { identifier } = req.body;
    const { verificationToken } = await forgotPasswordService(identifier);

    if (verificationToken) {
      res.cookie(
        "verificationToken",
        verificationToken,
        verificationCookieOptions
      );
    }

    const response = new ApiResponse(
      200,
      {},
      "If an account with that identifier exists, a password reset code has been sent."
    );

    res.status(response.statusCode).json(response);
  }
);

/**
 * POST /auth/reset-password
 * @access  Public (requires the `verificationToken` cookie from /auth/forgot-password)
 * @body    { otp, newPassword } — pre-validated by `validateResetPassword`
 * @cookie  Clears `verificationToken`, sets `refreshToken` to start a fresh session
 * @returns 200 { user, accessToken } — all other sessions are revoked server-side
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await resetPasswordService({
      verificationToken: req.cookies?.verificationToken,
      otp: req.body.otp,
      newPassword: req.body.newPassword,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.clearCookie("verificationToken", verificationCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    const response = new ApiResponse(
      200,
      { user, accessToken },
      "Password reset successfully"
    );

    res.status(response.statusCode).json(response);
  }
);
