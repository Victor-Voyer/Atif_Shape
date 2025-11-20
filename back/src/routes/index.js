import { Router } from "express";
import { notFound } from "../middlewares/404.js";
import usersRouter from "./users.routes.js";

const router = Router();

router.use("/users", usersRouter);


router.use(notFound);

export default router;