import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import ApiError from "#core/errors/ApiError.js";
import { PASSWORD_REGEX } from "#constants/regex.js";

const updatePasswordSchema = z.object({
  oldPassword: z
    .string()
    .regex(PASSWORD_REGEX, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),

  newPassword: z
    .string()
    .regex(PASSWORD_REGEX, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export function updatePasswordValidator(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = updatePasswordSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(
      400,
      "Invalid password format",
      result.error.flatten().fieldErrors
    );
  }
  req.body = result.data;
  next();
}
