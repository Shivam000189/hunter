import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as interviewService from "../services/interview.service";
import { asyncHandler } from "../utils/asyncHandler";

export const start = asyncHandler(async (req: AuthRequest, res: Response) => {
  const interview = await interviewService.startInterview(
    req.userId!,
    String(req.body.resumeText || ""),
    String(req.body.jobDescription || "")
  );
  res.status(201).json({ success: true, data: interview });
});

export const answer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const interview = await interviewService.answerInterview(
    req.userId!,
    req.params.id as string,
    String(req.body.answer || "")
  );
  res.json({ success: true, data: interview });
});

export const getOne = asyncHandler(async (req: AuthRequest, res: Response) => {
  const interview = await interviewService.getInterviewById(
    req.userId!,
    req.params.id as string
  );
  res.json({ success: true, data: interview });
});