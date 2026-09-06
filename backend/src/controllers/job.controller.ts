import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as jobService from "../services/job.service";
import { createJobSchema, updateJobSchema } from "../validation/job.validator";
import { asyncHandler } from "../utils/asyncHandler";

// GET ALL
export const getJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobs, total } = await jobService.getJobs(
    req.userId!,
    req.query
  );

  res.json({
    success: true,
    total,
    page: Number(req.query.page || 1),
    data: jobs,
  });
});

// CREATE
export const createJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  // VALIDATE INPUT
  const parsed = createJobSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues,
    });
  }

  const job = await jobService.createJob(
    req.userId!,
    parsed.data // use validated data
  );

  res.status(201).json({
    success: true,
    data: {
      _id: job.id,
      company: job.company,
      role: job.role,
      status: job.status.toLowerCase(),
      appliedDate: job.appliedDate,
      createdAt: job.createdAt,
    },
  });
});

// GET ONE
export const getJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const job = await jobService.getJobById(req.userId!, id);

  res.json({
    success: true,
    data: {
      _id: job.id,
      ...job,
    },
  });
});

// UPDATE
export const updateJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const parsed = updateJobSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues,
    });
  }

  const job = await jobService.updateJob(req.userId!, id, parsed.data);

  res.json({
    success: true,
    data: {
      _id: job.id,
      ...job,
    },
  });
});

// UPDATE STATUS
export const updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const { status } = req.body;

  // VALIDATE FIRST
  const validStatus = ["applied", "interview", "offer", "rejected"];

  if (!status || typeof status !== "string") {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  if (!validStatus.includes(status.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  const job = await jobService.updateStatus(
    req.userId!,
    id,
    status
  );

  res.json({
    success: true,
    message: "Status updated",
    data: {
      _id: job.id,
      status: job.status.toLowerCase(),
      updatedAt: job.updatedAt,
    },
  });
});

// DELETE
export const deleteJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  await jobService.deleteJob(req.userId!, id);

  res.json({
    success: true,
    message: "Job application deleted successfully",
  });
});
