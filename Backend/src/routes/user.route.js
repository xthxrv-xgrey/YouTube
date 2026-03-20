import { Router } from "express";
import { registerUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/getUsers").get(getUsers);

export default userRouter;
