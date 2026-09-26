import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import ApiError from "#core/errors/ApiError.js";

const verifyEmailSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain only digits."),
});

/**
 * Validates and normalizes email verification input.
 */
export function verifyEmailValidator(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = verifyEmailSchema.safeParse(req.body);
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
