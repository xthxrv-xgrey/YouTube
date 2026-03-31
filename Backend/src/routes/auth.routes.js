import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/verify-user", authController.verifyUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/logout-all", authController.logoutAll);
router.post("/refresh", authController.refreshAccessToken);

export default router;
