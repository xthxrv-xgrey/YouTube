import SessionModel from "../models/session.model";
import { verifyRefreshToken } from "../utils/token.utils";

export const logoutUser = async (refreshTokens: string) => {
  const { sessionId } = verifyRefreshToken(refreshTokens);

  await SessionModel.findByIdAndDelete(sessionId);
};
