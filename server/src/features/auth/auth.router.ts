import { Router } from "express";
import {
  validateRegister,
  validateEmailVerification,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateRefresh,
} from "#features/auth/validators/auth.validator.js";
import { authMiddleware } from "#core/middlewares/auth.middleware.js";
import { register } from "./controllers/register.controller.js";
import { verifyEmail } from "./controllers/verify.controller.js";
import { login } from "./controllers/login.controller.js";
import { logout, logoutAllDevices } from "./controllers/logout.controller.js";
import { refresh } from "./controllers/refresh.controller.js";
import { changePassword } from "./controllers/change-password.controller.js";
import { forgotPassword } from "./controllers/forgot-password.controller.js";
import { resetPassword } from "./controllers/reset-password.controller.js";

const router = Router();

// --- Registration & session bootstrap ---
router.post("/register", validateRegister, register);
router.post("/verify-email", validateEmailVerification, verifyEmail);
router.post("/login", validateLogin, login);

// --- Session lifecycle ---
router.post("/logout", authMiddleware, logout);
router.post("/logout-all", authMiddleware, logoutAllDevices);
router.post("/refresh", validateRefresh, refresh);

// --- Password management ---
router.post(
  "/change-password",
  authMiddleware,
  validateChangePassword,
  changePassword
);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);

export default router;
