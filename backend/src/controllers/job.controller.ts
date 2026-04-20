import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as jobService from "../services/job.service";

// GET ALL
export const getJobs = async (req: AuthRequest, res: Response) => {
  const { jobs, total } = await jobService.getJobs(
    req.userId!,
    req.query
  );

  res.json({
    success: true,
    total,
    page: Number(req.query.page || 1),
    data: jobs.map((job) => ({
      _id: job.id,
      ...job,
    })),
  });
};

// CREATE
export const createJob = async (req: AuthRequest, res: Response) => {
  const job = await jobService.createJob(req.userId!, req.body);

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
};

// GET ONE
export const getJob = async (req: AuthRequest, res: Response) => {
    
    const id = req.params.id;

    if (!id || typeof id !== "string") {
    return res.status(400).json({
        success: false,
        message: "Invalid ID",
    });
    }
  
    const job = await jobService.getJobById(
        req.userId!,
        id
    );
  

  res.json({
    success: true,
    data: {
      _id: job.id,
      ...job,
    },
  });
};

// UPDATE
export const updateJob = async (req: AuthRequest, res: Response) => {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
    return res.status(400).json({
        success: false,
        message: "Invalid ID",
    });
    }
  
    const job = await jobService.updateJob(
    req.userId!,
    id,
    req.body
  );

  res.json({
    success: true,
    data: {
      _id: job.id,
      ...job,
    },
  });
};

// UPDATE STATUS
export const updateStatus = async (req: AuthRequest, res: Response) => {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
    return res.status(400).json({
        success: false,
        message: "Invalid ID",
    });
    }
  
    const job = await jobService.updateStatus(
        req.userId!,
        id,
        req.body.status
    );
    const { status } = req.body;

    if (!status || typeof status !== "string") {
    return res.status(400).json({
        success: false,
        message: "Status is required",
    });
    }

  res.json({
    success: true,
    message: "Status updated",
    data: {
      _id: job.id,
      status: job.status.toLowerCase(),
      updatedAt: job.updatedAt,
    },
  });
};

// DELETE
export const deleteJob = async (req: AuthRequest, res: Response) => {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
    return res.status(400).json({
        success: false,
        message: "Invalid ID",
    });
    }
  await jobService.deleteJob(req.userId!, id);

  res.json({
    success: true,
    message: "Job application deleted successfully",
  });
};