import mongoose from "mongoose";
import { config } from "../config/config.js";

const ConnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${config.MONGODB_URI}`);
    console.log(`\n MongoDB Connected : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error : ", error);
    process.exit(1);
  }
};

export default ConnectDB;
