import { Router } from "express";
import { authMiddleware } from "#core/middlewares/auth/auth.middleware.js";
import imageUpload from "#core/middlewares/upload/imageUpload.js";

import { meController } from "./controllers/me.controller.js";
import { userController } from "./controllers/user.controller.js";

import { updateNameValidator } from "./validators/update-name.validator.js";
import { updateNameController } from "./controllers/update-name.controller.js";

import { updateUsernameValidator } from "./validators/update-username.validator.js";
import { updateUsernameController } from "./controllers/update-username.controller.js";
import { updateAvatarController } from "./controllers/update-avatar.controller.js";

const router = Router();

router.get("/me", authMiddleware, meController);
router.get("/@:username", userController);

router.patch(
  "/name",
  authMiddleware,
  updateNameValidator,
  updateNameController
);

router.patch(
  "/username",
  authMiddleware,
  updateUsernameValidator,
  updateUsernameController
);

router.patch(
  "/avatar",
  authMiddleware,
  imageUpload.single("avatar"),
  updateAvatarController
);

export default router;
