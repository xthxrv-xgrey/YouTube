import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

const requiredEnvFields = [
  "PORT",
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "VERIFICATION_TOKEN_SECRET",
  "VERIFICATION_TOKEN_EXPIRY",
  "DEFAULT_AVATAR",
] as const;

const missingFields = requiredEnvFields.filter((field) => !process.env[field]);

if (missingFields.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingFields.join(", ")}`
  );

  process.exit(1);
}

const port = Number(process.env.PORT);

if (Number.isNaN(port) || port <= 0) {
  console.error("❌ PORT must be a valid positive number.");
  process.exit(1);
}

const env = {
  PORT: port,

  MONGODB_URI: process.env.MONGODB_URI!,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY! as StringValue,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY! as StringValue,

  VERIFICATION_TOKEN_SECRET: process.env.VERIFICATION_TOKEN_SECRET!,
  VERIFICATION_TOKEN_EXPIRY: process.env
    .VERIFICATION_TOKEN_EXPIRY! as StringValue,

  DEFAULT_AVATAR: process.env.DEFAULT_AVATAR!,
} as const;

export default env;
