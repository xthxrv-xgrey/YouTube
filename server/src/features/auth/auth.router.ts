import { Router } from "express";
import {
  login,
  logout,
  logoutAllDevices,
  refresh,
  register,
  verifyEmail,
} from "#features/auth/controllers/auth.controller.js";
import {
  validateRegister,
  validateEmailVerification,
  validateLogin,
} from "#features/auth/validators/auth.validator.js";
import { authMiddleware } from "#core/middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/verify-email", validateEmailVerification, verifyEmail);
router.post("/login", validateLogin, login);

router.post("/logout", authMiddleware, logout);
router.post("/logout-all", authMiddleware, logoutAllDevices);

router.post("/refresh", refresh);

// TODO: implement password-management flows

// router.post("/change-password", authMiddleware, changePassword);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

export default router;
