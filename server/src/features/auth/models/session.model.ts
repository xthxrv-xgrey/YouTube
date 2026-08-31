import mongoose, { HydratedDocument, Types } from "mongoose";

export interface ISession {
  userId: Types.ObjectId;
  ip: string;
  userAgent: string;
  refreshTokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SessionDocument = HydratedDocument<ISession>;

const sessionSchema = new mongoose.Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    ip: {
      type: String,
      required: true,
      trim: true,
    },

    userAgent: {
      type: String,
      required: true,
      trim: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically deletes the session when expiresAt is reached.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel = mongoose.model<ISession>("Session", sessionSchema);
