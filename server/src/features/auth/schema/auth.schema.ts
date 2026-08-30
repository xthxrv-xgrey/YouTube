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
