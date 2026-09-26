import { Router } from "express";

import { authMiddleware } from "#core/middlewares/auth/auth.middleware.js";
import imageUpload from "#core/middlewares/upload/imageUpload.js";

import { meController } from "./controllers/me.controller.js";
import { userController } from "./controllers/user.controller.js";
import { updateNameController } from "./controllers/update-name.controller.js";
import { updateUsernameController } from "./controllers/update-username.controller.js";
import { updateAvatarController } from "./controllers/update-avatar.controller.js";
import { updatePasswordController } from "./controllers/update-password.controller.js";

import { updateNameValidator } from "./validators/update-name.validator.js";
import { updateUsernameValidator } from "./validators/update-username.validator.js";
import { updatePasswordValidator } from "./validators/update-password.validator.js";

const router = Router();

/**
 * @route   GET /api/v1/user/me
 * @desc    Get the currently authenticated user's profile
 * @access  Private
 */
router.get("/me", authMiddleware, meController);

/**
 * @route   GET /api/v1/user/@:username
 * @desc    Get a user's public profile by username
 * @access  Public
 */
router.get("/@:username", userController);

/**
 * @route   PATCH /api/v1/user/name
 * @desc    Update the authenticated user's name
 * @access  Private
 */
router.patch(
  "/name",
  authMiddleware,
  updateNameValidator,
  updateNameController
);

/**
 * @route   PATCH /api/v1/user/username
 * @desc    Update the authenticated user's username
 * @access  Private
 */
router.patch(
  "/username",
  authMiddleware,
  updateUsernameValidator,
  updateUsernameController
);

/**
 * @route   PATCH /api/v1/user/avatar
 * @desc    Update the authenticated user's avatar
 * @access  Private
 * @body    multipart/form-data
 */
router.patch(
  "/avatar",
  authMiddleware,
  imageUpload.single("avatar"),
  updateAvatarController
);

/**
 * @route   PATCH /api/v1/user/password
 * @desc    Change the authenticated user's password
 * @access  Private
 */
router.patch(
  "/password",
  authMiddleware,
  updatePasswordValidator,
  updatePasswordController
);

export default router;
