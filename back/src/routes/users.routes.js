import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/users.controller.js";
import { createUserValidation, updateUserValidation, handleValidationErrors } from "../middlewares/validators/user.validation.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUserValidation, handleValidationErrors, createUser);
router.put("/:id", updateUserValidation, handleValidationErrors, updateUser);
router.delete("/:id", deleteUser);

export default router;