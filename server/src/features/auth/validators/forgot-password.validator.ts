import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import { EMAIL_REGEX, USERNAME_REGEX } from "#constants/regex.js";

import ApiError from "#core/errors/ApiError.js";

const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username or email is required")
    .refine(
      (value) => EMAIL_REGEX.test(value) || USERNAME_REGEX.test(value),
      "Please provide a valid username or email address"
    )
    .transform((value) => value.toLowerCase()),
});

export function forgotPasswordValidator(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = forgotPasswordSchema.safeParse(req.body);

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
