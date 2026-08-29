import dotenv from "dotenv";

dotenv.config();

const requiredEnvFields = ["PORT", "MONGODB_URI"] as const;

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

export default {
  PORT: port,
  MONGODB_URI: process.env.MONGODB_URI!,
} as const;
