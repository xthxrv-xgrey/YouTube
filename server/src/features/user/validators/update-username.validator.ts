import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import ApiError from "#core/errors/ApiError.js";
import { USERNAME_REGEX } from "#constants/regex.js";

const updateUserameSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(
      USERNAME_REGEX,
      "Username must be 3-30 characters and can only contain letters, numbers, dots, and underscores"
    )
    .toLowerCase(),
});

export function updateUsernameValidator(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = updateUserameSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      "Invalid Username",
      result.error.flatten().fieldErrors
    );
  }

  req.body = result.data;
  next();
}
