import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/me", userController.getCurrentUser);
router.post("/me", authMiddleware, userController.updateCurrentUser);
router.post(
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  userController.updateCurrentUserAvatar,
);
router.post(
  "/me/banner",
  authMiddleware,
  upload.single("banner"),
  userController.updateCurrentBanner,
);

export default router;
