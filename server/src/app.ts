import express, { type Express } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fs from "node:fs/promises";

import ApiError from "#core/errors/ApiError.js";
import errorHandler from "#core/errors/errorHandler.js";

import authRouter from "#features/auth/auth.router.js";

import imageUpload from "#core/middlewares/upload/imageUpload.js";

const app: Express = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.post(
  "/api/v1/test/upload",
  imageUpload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const filePath = `./uploads-${req.file.originalname}`;

      await fs.writeFile(filePath, req.file.buffer);

      return res.status(200).json({
        message: "Upload successful",
        filename: req.file.originalname,
        size: req.file.size,
        path: filePath,
      });
    } catch (error) {
      next(error);
    }
  }
);

app.use((_req, _res, next) => {
  next(new ApiError(404, "Not Found"));
});

app.use(errorHandler);

export default app;
