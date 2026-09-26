import { InferSchemaType, Schema, model } from "mongoose";

const SessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
    },

    userAgent: String,
    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

export type Session = InferSchemaType<typeof SessionSchema>;
const SessionModel = model("Session", SessionSchema);

export default SessionModel;
