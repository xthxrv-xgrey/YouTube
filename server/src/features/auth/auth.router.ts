import { Router } from "express";
import { authMiddleware } from "#core/middlewares/auth/auth.middleware.js";

import { registerValidator } from "./validators/register.validator.js";
import { registerController } from "./controllers/register.controller.js";

import { verifyEmailValidator } from "./validators/verify-email.validator.js";
import { verifyEmailController } from "./controllers/verify-email.controller.js";

import { loginValidator } from "./validators/login.validator.js";
import { loginController } from "./controllers/login.controller.js";

import { logoutController } from "./controllers/logout.controller.js";
import { logoutAllController } from "./controllers/logout-all.controller.js";
import { refreshController } from "./controllers/refresh.controller.js";

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

/**
 * POST /api/v1/auth/login
 *
 * Logins the user.
 *
 * Flow:
 * Validate input → get user → create session → issue access/refresh tokens.
 */
router.post("/login", loginValidator, loginController);

/**
 * POST /api/v1/auth/refresh
 *
 * Refreshes access and refresh tokens.
 *
 *
 */
router.post("/refresh", refreshController);

/**
 * POST /api/v1/auth/logout
 *
 * Logouts the user from the current device.
 *
 * Flow:
 * Validate Auth → delete session → remove refresh token.
 */
router.post("/logout", authMiddleware, logoutController);

/**
 * POST /api/v1/auth/logout-all
 *
 * Logouts the user from all the devices.
 *
 * Flow:
 * Validate Auth → delete sessions → remove refresh token.
 */
router.post("/logout-all", authMiddleware, logoutAllController);

export default router;
