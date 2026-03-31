import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const GOOGLE_EMAIL_USER = process.env.GOOGLE_EMAIL_USER;
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD;

if (!PORT) throw new Error("PORT is not defined");
if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");
if (!NODE_ENV) throw new Error("NODE_ENV is not defined");
if (!CORS_ORIGIN) throw new Error("CORS_ORIGIN is not defined");
if (!ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET is not defined");
if (!ACCESS_TOKEN_EXPIRY) throw new Error("ACCESS_TOKEN_EXPIRY is not defined");
if (!REFRESH_TOKEN_SECRET)
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
if (!REFRESH_TOKEN_EXPIRY)
  throw new Error("REFRESH_TOKEN_EXPIRY is not defined");
if (!GOOGLE_EMAIL_USER) throw new Error("GOOGLE_EMAIL_USER is not defined");
if (!GOOGLE_APP_PASSWORD) throw new Error("GOOGLE_APP_PASSWORD is not defined");

export const config = {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  CORS_ORIGIN,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  GOOGLE_EMAIL_USER,
  GOOGLE_APP_PASSWORD,
};
