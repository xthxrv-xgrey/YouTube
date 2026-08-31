import { z } from "zod";
import { USERNAME_REGEX, NAME_REGEX } from "#constants/regex.js";

/** Body shape for POST /auth/register */
export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(NAME_REGEX, "Invalid first name"),

  lastName: z
    .string()
    .trim()
    .max(50, "Last name cannot exceed 50 characters")
    .regex(NAME_REGEX, "Invalid last name"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(USERNAME_REGEX, "Invalid username"),

  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

/** Body shape for POST /auth/verify-email */
export const emailVerificationSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain exactly 6 digits"),
});

/** Full input shape consumed by verifyUserEmail */
export const verifyEmailInputSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain exactly 6 digits"),

  ip: z.string().optional(),
  userAgent: z.string().optional(),

  verificationToken: z.string().min(1, "Verification token is required"),
});

/** Shared identifier validation */
const identifierSchema = z
  .string()
  .trim()
  .min(1, "Email or username is required")
  .refine(
    (value) =>
      z.string().email().safeParse(value).success || USERNAME_REGEX.test(value),
    {
      message: "Enter a valid email or username",
    }
  );

/** Body shape for POST /auth/login */
export const loginSchema = z.object({
  identifier: identifierSchema,

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

/** Full input shape consumed by loginUser */
export const loginInputSchema = z.object({
  identifier: identifierSchema,

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

export const logoutInputSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required."),
});

export const logoutAllDevicesInputSchema = z.object({
  userId: z.string().min(1, "userId is required."),
});

/**
 * Body shape for POST /auth/change-password
 *
 * userId is NOT accepted from the client.
 * It comes from req.user after authMiddleware.
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  newPassword: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

/** Full input consumed by changePasswordService */
export const changePasswordInputSchema = z.object({
  userId: z.string().min(1, "userId is required."),

  currentPassword: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  newPassword: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

/**
 * Body shape for POST /auth/forgot-password
 *
 * Client sends:
 * {
 *   "identifier": "username"
 * }
 */
export const forgotPasswordSchema = z.object({
  identifier: identifierSchema,
});

/**
 * Full input consumed by resetPasswordService
 */
export const resetPasswordInputSchema = z.object({
  verificationToken: z.string().optional(),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain exactly 6 digits"),

  newPassword: z.string().min(8, "Password must be at least 8 characters"),

  ip: z.string().optional(),
  userAgent: z.string().optional(),
});

/**
 * Body shape for POST /auth/reset-password
 *
 * Client sends:
 * {
 *   "otp": "000000",
 *   "newPassword": "12345678"
 * }
 */
export const resetPasswordSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain exactly 6 digits"),

  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
