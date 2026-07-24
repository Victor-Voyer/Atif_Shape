import { Router } from "express";
import {
  updateUser,
  deleteUser,
  getUserStats,
  getUserById,
} from "../controllers/users.controller.js";
import { createWeight } from "../controllers/weights.controller.js";
import {
  updateUserValidation,
  createWeightValidation,
  handleValidationErrors,
} from "../middlewares/validators/user.validation.js";
import { verifyToken, requireSelf } from "../middlewares/auth.js";

const router = Router();

router.get("/:id", verifyToken, requireSelf, getUserById);
router.put(
  "/:id",
  verifyToken,
  requireSelf,
  updateUserValidation,
  handleValidationErrors,
  updateUser
);
router.delete("/:id", verifyToken, requireSelf, deleteUser);
router.get("/:id/stats", verifyToken, requireSelf, getUserStats);
router.post(
  "/:id/weights",
  verifyToken,
  requireSelf,
  createWeightValidation,
  handleValidationErrors,
  createWeight
);

export default router;
