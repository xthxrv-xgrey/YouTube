import { Router } from "express";
import { register, verifyEmail } from "./controllers/auth.controller.js";
import {
  validateRegister,
  validateEmailVerification,
} from "./validators/auth.validator.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/verify-email", validateEmailVerification , verifyEmail);

export default router;
