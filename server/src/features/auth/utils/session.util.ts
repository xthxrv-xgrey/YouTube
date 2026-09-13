import SessionModel from "#features/auth/models/session.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "./token.utils.js";

interface CreateSessionInput {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
}

export const createSession = async (input: CreateSessionInput) => {
  const { userId } = input;

  const accessToken = generateAccessToken(userId);

  const session = await SessionModel.create(input);

  const refreshToken = generateRefreshToken(userId, session._id.toString());

  session.refreshTokenHash = hashRefreshToken(refreshToken);

  await session.save();

  return {
    session,
    refreshToken,
    accessToken,
  };
};
