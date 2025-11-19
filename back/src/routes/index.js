import { Router } from "express";
import { notFound } from "../middlewares/404.js";

const router = Router();


router.use(notFound);

export default router;