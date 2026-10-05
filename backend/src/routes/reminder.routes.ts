import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as reminderController from "../controllers/reminder.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", reminderController.getLogs);
router.get("/pending", reminderController.getPending);
router.post("/acknowledge", reminderController.acknowledge);
router.get("/settings", reminderController.getSettings);
router.patch("/settings", reminderController.updateSettings);

export default router;
