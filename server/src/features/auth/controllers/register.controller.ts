import asyncHandler from "#core/utils/asyncHandler.js";
import { Request, Response } from "express";
import { registerService } from "../services/register.service.js";
import { verificationCookieOptions } from "../config/auth.cookie.js";
import ApiResponse from "#core/utils/ApiResponse.js";

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
