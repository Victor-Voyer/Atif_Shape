import { Router } from "express";
import { registerUser, login } from "../controllers/auth.controller.js";
import {
  registerValidation,
  loginValidation,
  handleValidationErrors,
} from "../middlewares/validators/user.validation.js";

const router = Router();

router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  registerUser
);
router.post("/login", loginValidation, handleValidationErrors, login);

export default router;
