import type { HydratedDocument } from "mongoose";
import type { User } from "../features/user/models/user.model.js";
import type { Session } from "../features/auth/models/session.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<User>;
      session?: HydratedDocument<Session>;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: HydratedDocument<User>;
    session?: HydratedDocument<Session>;
  }
}

export {};
