import { Router } from "express";

import { registerValidator } from "./validators/register.validator.js";
import { registerController } from "./controllers/register.controller.js";

import { verifyEmailValidator } from "./validators/verify-email.validator.js";
import { verifyEmailController } from "./controllers/verify-email.controller.js";

const router = Router();

/**
 * POST /api/v1/auth/register
 *
 * Initiates registration and sends an OTP for email verification.
 *
 * Flow:
 * Validate input → create unverified user → send OTP → set verification token.
 */
router.post("/register", registerValidator, registerController);

/**
 * POST /api/v1/auth/verify-email
 *
 * Verifies the OTP and completes user registration.
 *
 * Flow:
 * Validate OTP → verify token → verify OTP → create user →
 * create session → issue access/refresh tokens.
 */
router.post("/verify-email", verifyEmailValidator, verifyEmailController);

export default router;
