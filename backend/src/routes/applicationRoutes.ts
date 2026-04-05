import { Router } from "express";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController";

import { validate } from "../middleware/validate";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../validation/applicationValidator";

const router = Router();

router.post("/", validate(createApplicationSchema), createApplication);

router.get("/", getApplications);

router.patch("/:id", validate(updateApplicationSchema), updateApplication);

router.delete("/:id", deleteApplication);

export default router;