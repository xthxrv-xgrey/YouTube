import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: err.data || null,
  });
});

// Routes import
import authRouter from "./routes/auth.routes.js";

// Routes declaration
app.use("/api/v1/auth", authRouter);

export default app;
