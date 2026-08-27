import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "../middleware/auth.middleware";
import * as interviewController from "../controllers/interview.controller";

const router = Router();
router.use(authMiddleware);

const interviewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many interview requests, try again later" },
});

router.post("/", interviewLimiter, interviewController.start);
router.get("/:id", interviewController.getOne);
router.post("/:id/answer", interviewLimiter, interviewController.answer);

export default router;