import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (_: Request, res: Response) => {
  res.send("Hello");
});

export default app;
