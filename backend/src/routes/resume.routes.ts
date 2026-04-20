import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import * as resumeController from "../controllers/resume.controller";

const router = Router();

router.use(authMiddleware);

router.post("/upload", upload.single("file"), resumeController.upload);

router.get("/", resumeController.getAll);
router.get("/:id", resumeController.getOne);
router.delete("/:id", resumeController.remove);

export default router;