import express, { type Express, type Request, type Response } from "express";
import cookieParser from "cookie-parser";

import ApiResponse from "#core/utils/ApiResponse.js";
import ApiError from "#core/errors/ApiError.js";
import errorHandler from "#core/errors/errorHandler.js";

import authRouter from "#features/auth/auth.router.js";

/*
 * ==========================================================================
 * Create Express Application
 * ==========================================================================
 *
 * app is responsible for configuring:
 * - Middleware
 * - Routes
 * - Error handling
 * - Other Express settings
 */
const app: Express = express();

/*
 * ==========================================================================
 * DEVELOPMENT MIDDLEWARE
 * ==========================================================================
 *
 * Morgan logs every HTTP request received by the server.
 *
 * Example output:
 *
 * GET /api/v1/auth/login 200 15.234 ms - 123
 *
 * Remove this middleware when you no longer need request logging in
 * development.
 *
 * To completely remove Morgan:
 *
 *     npm uninstall morgan
 *
 * ==========================================================================
 * MORGAN - START
 * ==========================================================================
 */

import morgan from "morgan";
app.use(morgan("dev"));
// npm uninstall morgan

/*
 * ==========================================================================
 * MORGAN - END
 * ==========================================================================
 */

/*
 * ==========================================================================
 * Built-in Express Middleware
 * ==========================================================================
 *
 * Parses incoming JSON request bodies.
 *
 * Example request:
 *
 * POST /users
 * Content-Type: application/json
 *
 * {
 *   "name": "John"
 * }
 *
 * After this middleware:
 *
 * req.body
 *
 * contains:
 *
 * {
 *   name: "John"
 * }
 */
app.use(express.json());
app.use(cookieParser());
/*
 * ==========================================================================
 * Routes
 * ==========================================================================
 */

/*
 * Authentication routes
 *
 * Examples:
 *
 * POST /api/v1/auth/register
 * POST /api/v1/auth/login
 * POST /api/v1/auth/logout
 */
app.use("/api/v1/auth", authRouter);

/*
 * ==========================================================================
 * Health Check / Home Route
 * ==========================================================================
 *
 * Useful for quickly checking whether the API server is running.
 */
app.get("/", (_req: Request, res: Response) => {
  return res.send(`
    <h1>API is running 🚀</h1>

    <ul>
      <li><a href="/response">Test Success Response</a></li>
      <li><a href="/error">Test Error Response</a></li>
    </ul>
  `);
});

/*
 * ==========================================================================
 * Test Success Response
 * ==========================================================================
 *
 * ApiResponse gives successful API responses a consistent structure.
 *
 * Example response:
 *
 * {
 *   "statusCode": 200,
 *   "success": true,
 *   "message": "User fetched successfully",
 *   "data": {
 *     "name": "John",
 *     "age": 25
 *   }
 * }
 */
app.get("/response", (_req: Request, res: Response) => {
  const data = {
    name: "John",
    age: 25,
  };

  const response = new ApiResponse(200, data, "User fetched successfully");

  return res.status(response.statusCode).json(response);
});

/*
 * ==========================================================================
 * Test Error Response
 * ==========================================================================
 *
 * Instead of manually sending an error response, we throw ApiError.
 *
 * The error is then handled by the global errorHandler below.
 *
 * Flow:
 *
 *     throw new ApiError(...)
 *              ↓
 *        errorHandler
 *              ↓
 *       JSON error response
 */
app.get("/error", (_req: Request, _res: Response) => {
  throw new ApiError(404, "User not found");
});

/*
 * ==========================================================================
 * GLOBAL ERROR HANDLER
 * ==========================================================================
 *
 * IMPORTANT:
 * This middleware must ALWAYS be registered AFTER all routes.
 *
 * When a route throws an error:
 *
 *     Route
 *       ↓
 *     ApiError
 *       ↓
 *   errorHandler
 *       ↓
 *   JSON response
 *
 * Keeping error handling in one place prevents repeating:
 *
 *     res.status(...).json(...)
 *
 * inside every controller.
 */
app.use((_req, _res, next) => next(new ApiError(404, "Not Found")));
app.use(errorHandler);

/*
 * ==========================================================================
 * Export Application
 * ==========================================================================
 *
 * server.ts imports this configured Express application and calls:
 *
 *     app.listen(...)
 *
 * Keeping app configuration and server startup separate makes the
 * application easier to test and maintain.
 */
export default app;
