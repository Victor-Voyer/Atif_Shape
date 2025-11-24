import { Router } from "express";
import { notFound } from "../middlewares/404.js";
import usersRouter from "./users.routes.js";
import authRouter from "./auth.routes.js";
const router = Router();

router.use("/users", usersRouter);
router.use("/auth", authRouter);

router.use(notFound);

export default router;