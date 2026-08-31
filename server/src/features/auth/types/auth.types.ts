import { z } from "zod";
import {
  changePasswordInputSchema,
  loginInputSchema,
  logoutAllDevicesInputSchema,
  logoutInputSchema,
  registerSchema,
  resetPasswordInputSchema,
  verifyEmailInputSchema,
} from "#features/auth/schema/auth.schema.js";

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type LogoutInput = z.infer<typeof logoutInputSchema>;
export type LogoutAllDevicesInput = z.infer<typeof logoutAllDevicesInputSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
