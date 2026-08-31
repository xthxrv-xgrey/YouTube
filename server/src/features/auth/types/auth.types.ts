import { z } from "zod";
import {
  loginInputSchema,
  logoutAllDevicesInputSchema,
  logoutInputSchema,
  registerSchema,
  verifyEmailInputSchema,
} from "#features/auth/schema/auth.schema.js";

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type LogoutInput = z.infer<typeof logoutInputSchema>;
export type LogoutAllDevicesInput = z.infer<typeof logoutAllDevicesInputSchema>;
