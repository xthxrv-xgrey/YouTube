import { Request, Response, Router } from "express";
import { registerController } from "./controllers/register.controller.js";
import { verifyUserController } from "./controllers/verify-user.controller.js";
import { loginController } from "./controllers/login.controller.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.send("Auth Route");
});

router.post("/register", registerController);
router.post("/verify-user", verifyUserController);
router.post("/login", loginController);

export default router;
