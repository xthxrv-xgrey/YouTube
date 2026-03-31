import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", authController.registerUser);
router.post("/verify-user", authController.verifyUser);
router.post("/login", authController.loginUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", authController.refreshAccessToken);

// Private routes
router.post("/logout", authMiddleware, authController.logoutUser);
router.post("/logout-all", authMiddleware, authController.logoutAll);
router.post("/change-password", authMiddleware, authController.changePassword);

export default router;
