// auth.middleware.js
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Session } from "../models/userSubModels/session.model.js";

/**
 * Middleware to protect routes that require authentication.
 * Verifies the access token and attaches the user & session to req object.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get the access token from Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized access. No token provided.");
    }
    const token = authHeader.replace("Bearer ", "").trim();

    // 2. Verify the JWT
    let decoded;
    try {
      decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired access token.");
    }

    // 3. Fetch the user from DB
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // 4. Fetch the session
    const session = await Session.findById(decoded.sessionId);
    if (!session) {
      throw new ApiError(401, "Session not found or expired.");
    }

    // 5. Attach user & session to request object
    req.user = user;
    req.session = session;

    next();
  } catch (err) {
    next(err);
  }
};
