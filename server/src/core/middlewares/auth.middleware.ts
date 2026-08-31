import env from "#config/env.js";
import ApiError from "#core/errors/ApiError.js";
import { SessionModel } from "#features/auth/models/session.model.js";
import { UserModel } from "#features/user/user.model.js";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { AccessTokenPayload } from "#features/auth/types/token-payload.types.js";

/**
 * Type guard confirming a decoded JWT payload has the shape
 * we expect from an access token.
 */
const isAccessTokenPayload = (
  payload: string | JwtPayload
): payload is AccessTokenPayload => {
  return (
    typeof payload !== "string" &&
    typeof payload.userId === "string" &&
    typeof payload.sessionId === "string"
  );
};

/**
 * Verifies the Bearer access token on incoming requests, then attaches
 * the resolved `user` and `session` documents to `req` for downstream
 * handlers.
 */
export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized access. No token provided.");
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new ApiError(401, "Unauthorized access. No token provided.");
    }

    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    } catch {
      throw new ApiError(401, "Invalid or expired access token.");
    }

    if (!isAccessTokenPayload(decoded)) {
      throw new ApiError(401, "Invalid access token payload.");
    }

    const [user, session] = await Promise.all([
      UserModel.findById(decoded.userId),
      SessionModel.findById(decoded.sessionId),
    ]);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (!session) {
      throw new ApiError(401, "Session not found or expired.");
    }

    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    next(error);
  }
};
