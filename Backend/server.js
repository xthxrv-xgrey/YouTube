import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/db/db.js";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MONGODB connection error", error);
    process.exit(1);
  });
