import { z } from "zod";
import {
  registerSchema,
  verifyEmailInputSchema,
} from "../schema/auth.schema.js";

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailInputSchema>;
