import ApiError from "#core/errors/ApiError.js";
import { SessionModel } from "../models/session.model.js";
import { LogoutAllDevicesInput, LogoutInput } from "../types/auth.types.js";

/**
 * Logs a user out of the current device/session.
 */
export const logoutService = async ({ sessionId }: LogoutInput) => {
  return await SessionModel.findByIdAndDelete(sessionId);
};

/**
 * Logs a user out of every device.
 */
export const logoutAllDevicesService = async ({
  userId,
}: LogoutAllDevicesInput) => {
  const result = await SessionModel.deleteMany({ userId });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No active sessions found.");
  }

  return result;
};
