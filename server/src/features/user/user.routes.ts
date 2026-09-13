import { Router } from "express";
import { authMiddleware } from "#core/middlewares/auth.middleware.js";
import { profileController } from "./controllers/profile.controller.js";

const router = Router();

router.get("/me", authMiddleware, profileController);

export default router;
