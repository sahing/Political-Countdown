import { Router, type IRouter } from "express";
import healthRouter from "./health";
import commentsRouter from "./comments";
import promisesRouter from "./promises";

const router: IRouter = Router();

router.use(healthRouter);
router.use(commentsRouter);
router.use(promisesRouter);

export default router;
