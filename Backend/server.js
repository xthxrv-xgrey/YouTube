import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import ConnectDB from "./src/db/db.js";
import { config } from "./src/config/config.js";

(async () => {
  try {
    await ConnectDB();
    const PORT = config.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is Running on PORT : ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to run the app");
  }
})();
