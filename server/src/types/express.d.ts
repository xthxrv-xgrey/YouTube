import type { HydratedDocument } from "mongoose";
import type { User } from "../features/user/models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<User>;
    }
  }
}

export {};
