import mongoose from "mongoose";

const deleteUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
    index: true,
  },
});

const DeleteUser = mongoose.model("DeleteUser", deleteUserSchema);
export { DeleteUser };
