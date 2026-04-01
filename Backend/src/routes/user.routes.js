import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/me", authMiddleware, userController.getCurrentUser);
router.patch("/me", authMiddleware, userController.updateCurrentUser);
router.patch(
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  userController.updateCurrentUserAvatar,
);
router.patch(
  "/me/banner",
  authMiddleware,
  upload.single("banner"),
  userController.updateCurrentUserBanner,
);

export default router;
