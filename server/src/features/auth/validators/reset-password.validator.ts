import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import ApiError from "#core/errors/ApiError.js";
import { PASSWORD_REGEX } from "#constants/regex.js";

const resetPasswordSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain only digits."),

  newPassword: z
    .string()
    .regex(PASSWORD_REGEX, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

/**
 * Validates and normalizes email verification input.
 */
export function resetPasswordValidator(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = resetPasswordSchema.safeParse(req.body);
  const verificationToken = req.cookies?.verificationToken;

  if (!result.success) {
    throw new ApiError(
      400,
      "Validation failed.",
      result.error.flatten().fieldErrors
    );
  }

  if (!verificationToken) {
    throw new ApiError(400, "Verification token not found.");
  }

  req.body = result.data;
  next();
}
