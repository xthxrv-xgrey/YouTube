import { z } from "zod";
import { USERNAME_REGEX, NAME_REGEX } from "#constants/regex.js";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(NAME_REGEX, "Invalid Name"),

  lastName: z
    .string()
    .trim()
    .max(50, "Last Name cannot exceed 50 characters")
    .regex(NAME_REGEX, "Invalid Name"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(USERNAME_REGEX, "Invalid username"),

  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const emailVerificationSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain exactly 6 digits"),
});

export const verifyEmailInputSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must contain exactly 6 digits"),

  ip: z.string().optional(),

  userAgent: z.string().optional(),

  verificationToken: z.string().min(1, "Verification token is required"),
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or username is required")
    .refine(
      (value) =>
        z.string().email().safeParse(value).success ||
        USERNAME_REGEX.test(value),
      {
        message: "Enter a valid email or username",
      }
    ),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const loginInputSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Email or username is required")
    .refine(
      (value) =>
        z.string().email().safeParse(value).success ||
        USERNAME_REGEX.test(value),
      {
        message: "Enter a valid email or username",
      }
    ),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),

  ip: z.string().optional(),

  userAgent: z.string().optional(),
});

export const logoutInputSchema = z.object({
  sessionId: z.string().min(1, "SessionId is required."),
});

export const logoutAllDevicesInputSchema = z.object({
  userId: z.string().min(1, "UserId is required."),
});
