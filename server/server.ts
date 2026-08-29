import app from "./src/app.js";
import connectDatabase from "#config/db.js";
import env from "#config/env.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();
