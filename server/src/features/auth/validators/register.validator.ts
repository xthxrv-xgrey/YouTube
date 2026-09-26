import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import {
  NAME_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
  PASSWORD_REGEX,
} from "#constants/regex.js";

import ApiError from "#core/errors/ApiError.js";

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(NAME_REGEX, "Name can only contain letters"),

  username: z
    .string()
    .trim()
    .regex(
      USERNAME_REGEX,
      "Username must be 3-30 characters and can only contain letters, numbers, dots, and underscores"
    )
    .toLowerCase(),

  email: z
    .string()
    .trim()
    .regex(EMAIL_REGEX, "Please provide a valid email address")
    .toLowerCase(),

  password: z
    .string()
    .regex(PASSWORD_REGEX, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

/**
 * Validates and normalizes registration input before reaching the controller.
 */
export function registerValidator(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = registerSchema.safeParse(req.body);

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
