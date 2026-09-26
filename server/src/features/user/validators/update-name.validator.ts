import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import ApiError from "#core/errors/ApiError.js";
import { NAME_REGEX } from "#constants/regex.js";

const updateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(NAME_REGEX, "Name can only contain letters"),
});

export function updateNameValidator(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = updateNameSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, "Invalid Name", result.error.flatten().fieldErrors);
  }

  req.body = result.data;
  next();
}
