import ApiError from "#core/errors/ApiError.js";
import { UserModel } from "#features/user/user.model.js";
import { sendPasswordChangeSuccess } from "#integrations/email/email.service.js";
import { ChangePasswordInput } from "../types/auth.types.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";

/**
 * Changes the authenticated user's password.
 */
export const changePasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}: ChangePasswordInput) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  const isSamePassword = await comparePassword(newPassword, user.password);

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password."
    );
  }

  user.password = await hashPassword(newPassword);

  await user.save();

  await sendPasswordChangeSuccess(user.email, user.firstName);
};
