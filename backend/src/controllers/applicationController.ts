import { Request, Response, NextFunction } from "express";
import {
  createApplicationService,
  getApplicationsService,
  updateApplicationService,
  deleteApplicationService,
} from "../services/applicationService";

// CREATE
export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const app = await createApplicationService(req.body);
    res.status(201).json(app);
  } catch (error) {
    next(error);
  }
};

// GET ALL
export const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

    const result = await getApplicationsService({
      status,
      search,
      page,
      limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ FIX ID
    const id =
      typeof req.params.id === "string" ? req.params.id : "";

    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // ✅ FIX STATUS
    const status = req.body.status;

    if (typeof status !== "string") {
      return res.status(400).json({ message: "Invalid status" });
    }

    const app = await updateApplicationService(id, status);

    res.json(app);
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ FIX ID
    const id =
      typeof req.params.id === "string" ? req.params.id : "";

    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await deleteApplicationService(id);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};