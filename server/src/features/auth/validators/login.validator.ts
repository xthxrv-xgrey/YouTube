import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import {
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
} from "#constants/regex.js";

import ApiError from "#core/errors/ApiError.js";

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username or email is required")
    .refine(
      (value) => EMAIL_REGEX.test(value) || USERNAME_REGEX.test(value),
      "Please provide a valid username or email address"
    )
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .regex(PASSWORD_REGEX, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

/**
 * Validates and normalizes login input before reaching the controller.
 */
export function loginValidator(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      "Validation failed",
      result.error.flatten().fieldErrors
    );
  }

  req.body = result.data;
  next();
}
