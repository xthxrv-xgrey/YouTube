import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { changePasswordService } from "../services/change-password.service.js";
import ApiResponse from "#core/utils/ApiResponse.js";

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
