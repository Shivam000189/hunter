import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as analyticsController from "../controllers/analytics.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", analyticsController.getAnalytics);
router.get("/weekly", analyticsController.getWeekly);

export default router;