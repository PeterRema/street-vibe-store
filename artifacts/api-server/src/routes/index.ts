import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import settingsRouter from "./settings";
import uploadRouter from "./upload";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(uploadRouter);
router.use(productsRouter);
router.use(settingsRouter);

export default router;
