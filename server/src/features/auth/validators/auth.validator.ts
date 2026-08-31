import type { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  emailVerificationSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "#features/auth/schema/auth.schema.js";

/** Validates POST /auth/register body against `registerSchema`. */
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

/**
 * Validates POST /auth/verify-email: checks the OTP body shape
 * and confirms a verification cookie was actually sent.
 */
export const validateEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = emailVerificationSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  const verificationToken = req.cookies?.verificationToken;
  if (!verificationToken) {
    return res.status(401).json({
      success: false,
      message: "Verification session not found or expired. Please start again.",
    });
  }

  req.body = result.data;
  next();
};

/** Validates POST /auth/login body against `loginSchema`. */
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

/**
 * Validates POST /auth/change-password body against `changePasswordSchema`.
 * Runs after `authMiddleware`, so `req.user` is guaranteed to exist by
 * the time this fires — only the body's password fields need checking.
 */
export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = changePasswordSchema.safeParse(req.body);

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

/** Validates POST /auth/forgot-password body against `forgotPasswordSchema`. */
export const validateForgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = forgotPasswordSchema.safeParse(req.body);

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

/**
 * Validates POST /auth/reset-password: checks the OTP + new-password
 * body shape and confirms a password-reset cookie was actually sent,
 * so a missing/expired cookie fails fast with a 401 before we bother
 * touching the database.
 */
export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = resetPasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues,
    });
  }

  const verificationToken = req.cookies?.verificationToken;
  if (!verificationToken) {
    return res.status(401).json({
      success: false,
      message:
        "Password reset session not found or expired. Please request a new reset.",
    });
  }

  req.body = result.data;
  next();
};

/**
 * Validates POST /auth/refresh: confirms a refresh-token cookie was
 * actually sent before hitting the service/database layer, so a
 * missing cookie fails fast with a consistent error shape instead of
 * falling through to the service's own check.
 */
export const validateRefresh = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided. Please log in again.",
    });
  }

  next();
};
