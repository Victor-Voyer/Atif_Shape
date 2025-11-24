import { Router } from "express";
import {
  createNewUserWeight,
  updateUser,
  deleteUser,
  getUserStats,
  getUserById,
} from "../controllers/users.controller.js";
import { updateUserValidation, handleValidationErrors } from "../middlewares/validators/user.validation.js";
import { verifyToken } from "../middlewares/auth.js";
const router = Router();

// router.get("/", getUsers);
router.get("/:id", verifyToken, getUserById);
router.post("/",verifyToken, createNewUserWeight);
router.put("/:id",verifyToken, updateUserValidation, handleValidationErrors, updateUser);
router.delete("/:id",verifyToken, handleValidationErrors, deleteUser);
router.get("/:id/stats",verifyToken, handleValidationErrors, getUserStats);

export default router;