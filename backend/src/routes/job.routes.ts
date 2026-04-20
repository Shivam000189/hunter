import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import * as jobController from "../controllers/job.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", jobController.getJobs);
router.post("/", jobController.createJob);

router.get("/:id", jobController.getJob);
router.patch("/:id", jobController.updateJob);
router.patch("/:id/status", jobController.updateStatus);

router.delete("/:id", jobController.deleteJob);

export default router;