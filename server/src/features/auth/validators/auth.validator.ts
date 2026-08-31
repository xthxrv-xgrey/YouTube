import type { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  emailVerificationSchema,
  loginSchema,
} from "#features/auth/schema/auth.schema.js";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  req.body = result.data;

  next();
};

export const validateEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = emailVerificationSchema.safeParse(req.body);

  // Validate request body
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  // Check verification token cookie
  const verificationToken = req.cookies?.verificationToken;

  if (!verificationToken) {
    return res.status(401).json({
      success: false,
      message: "Verification token is missing or expired",
    });
  }

  req.body = result.data;

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  req.body = result.data;
  next();
};
