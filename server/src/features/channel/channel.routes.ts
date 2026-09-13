import { Router } from "express";
import { authMiddleware } from "#core/middlewares/auth.middleware.js";
import { getChannelController } from "./controllers/get-channel.controller";
import { createChannelController } from "./controllers/create-channel.controller";

const router = Router();

router.get("/:channelHandle", getChannelController);
router.post("/create-channel", authMiddleware, createChannelController);

export default router;
