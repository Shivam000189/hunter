import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as reminderController from "../controllers/reminder.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", reminderController.getLogs);
router.post("/trigger", reminderController.trigger);
router.patch("/settings", reminderController.updateSettings);

export default router;