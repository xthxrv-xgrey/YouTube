import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import {
  logoutAllDevicesService,
  logoutService,
} from "../services/logout.service.js";
import { refreshCookieOptions } from "../config/auth.cookie.js";
import ApiResponse from "#core/utils/ApiResponse.js";

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
