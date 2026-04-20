import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as jobService from "../services/job.service";

// GET ALL
export const getJobs = async (req: AuthRequest, res: Response) => {
  try {
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
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
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
  try {
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
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
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