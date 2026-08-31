import { UserDocument } from "#features/user/user.model.ts";
import { SessionDocument } from "#features/auth/models/session.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      session?: SessionDocument;
    }
  }
}

export {};
