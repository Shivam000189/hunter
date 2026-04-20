import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as aiController from "../controllers/ai.controller";
import rateLimit from "express-rate-limit";

const router = Router();

router.use(authMiddleware);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5, // 5 requests per minute
  message: {
    success: false,
    message: "Too many AI requests, try later",
  },
});

router.post("/cover-letter", aiLimiter, aiController.generate);
router.get("/cover-letters", aiController.getAll);
router.get("/cover-letters/:id", aiController.getOne);

export default router;