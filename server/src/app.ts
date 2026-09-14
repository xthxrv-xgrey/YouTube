import express, { type Express } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import ApiError from "#core/errors/ApiError.js";
import errorHandler from "#core/errors/errorHandler.js";

import authRouter from "#features/auth/auth.router.js";
import userRouter from "#features/user/user.routes.js";
import channelRouter from "#features/channel/channel.routes.js";

const app: Express = express();

app.use(morgan("dev"));
// npm uninstall morgan

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/channel", channelRouter);

app.use((_req, _res, next) => next(new ApiError(404, "Not Found")));
app.use(errorHandler);

export default app;
