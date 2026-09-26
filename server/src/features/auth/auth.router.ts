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

import { forgotPasswordValidator } from "./validators/forgot-password.validator.js";
import { forgotPasswordController } from "./controllers/forgot-password.controller.js";

import { resetPasswordValidator } from "./validators/reset-password.validator.js";
import { resetPasswordController } from "./controllers/reset-password.controller.js";

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Initiate registration and send an email verification OTP
 * @access  Public
 *
 * Flow:
 * Validate input → create unverified user → send OTP → set verification token
 */
router.post("/register", registerValidator, registerController);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email and complete user registration
 * @access  Public
 *
 * Flow:
 * Validate input → verify token → verify OTP → create user →
 * create session → issue access/refresh tokens
 */
router.post("/verify-email", verifyEmailValidator, verifyEmailController);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate the user and create a session
 * @access  Public
 *
 * Flow:
 * Validate input → verify credentials → create session →
 * issue access/refresh tokens
 */
router.post("/login", loginValidator, loginController);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh the access token using the refresh token
 * @access  Public
 *
 * Flow:
 * Verify refresh token → validate session → rotate tokens →
 * issue new access/refresh tokens
 */
router.post("/refresh", refreshController);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Log out the user from the current device
 * @access  Private
 *
 * Flow:
 * Authenticate user → delete current session → clear refresh token
 */
router.post("/logout", authMiddleware, logoutController);

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Log out the user from all devices
 * @access  Private
 *
 * Flow:
 * Authenticate user → delete all sessions → clear refresh token
 */
router.post("/logout-all", authMiddleware, logoutAllController);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request a password reset OTP
 * @access  Public
 *
 * Flow:
 * Validate input → find account → generate OTP → store hashed OTP →
 * generate verification token → send reset email
 */
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  forgotPasswordController
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset the password using the OTP and verification token
 * @access  Public
 *
 * Flow:
 * Validate input → verify token → verify OTP → hash new password →
 * update password → invalidate reset request
 */
router.post("/reset-password", resetPasswordValidator, resetPasswordController);

export default router;
