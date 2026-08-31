import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  logoutAllDevices,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from "#features/auth/controllers/auth.controller.js";
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
