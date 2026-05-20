import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as resumeService from "../services/resume.service";

// UPLOAD
export const upload = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    const { versionName } = req.body;

    if (!versionName) {
      return res.status(400).json({ message: "versionName required" });
    }

    const result = await resumeService.uploadResume(
      req.userId!,
      file!,
      versionName
    );

    res.status(201).json({
      success: true,
      data: {
        _id: result.id,
        url: result.url,
        versionName: result.versionName,
        userId: result.userId,
        uploadedAt: result.uploadedAt,
        usage: result.totalUsed,
        interviews: result.interviews,
        offers: result.offers,
      },
    });
  } catch (err: any) {
    res.status(err.statusCode || err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL
export const getAll = async (req: AuthRequest, res: Response) => {
  const resumes = await resumeService.getResumes(req.userId!);

  res.json({
    success: true,
    data: resumes.map((r) => ({
      _id: r.id,
      url: r.url,
      versionName: r.versionName,
      uploadedAt: r.uploadedAt,
      usage: r.totalUsed,
      interviews: r.interviews,
      offers: r.offers,
      successRate: r.totalUsed
        ? Number(((r.interviews / r.totalUsed) * 100).toFixed(1))
        : 0,
    })),
  });
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  const data = await resumeService.getResumeAnalytics(req.userId!);

  res.json({
    success: true,
    data,
  });
};

// GET ONE
export const getOne = async (req: AuthRequest, res: Response) => {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
    return res.status(400).json({
        success: false,
        message: "Invalid ID",
    });
    }

  const resume = await resumeService.getResumeById(
    req.userId!,
    id
  );

  res.json({
    success: true,
    data: {
      _id: resume.id,
      url: resume.url,
      versionName: resume.versionName,
      uploadedAt: resume.uploadedAt,
      usage: resume.totalUsed,
      interviews: resume.interviews,
      offers: resume.offers,
      successRate: resume.totalUsed
        ? Number(((resume.interviews / resume.totalUsed) * 100).toFixed(1))
        : 0,
    },
  });
};

// DELETE
export const remove = async (req: AuthRequest, res: Response) => {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
    return res.status(400).json({
        success: false,
        message: "Invalid ID",
    });
    }
    await resumeService.deleteResume(req.userId!, id);

  res.json({
    success: true,
    message: "Resume deleted successfully",
  });
};
