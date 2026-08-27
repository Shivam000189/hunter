import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as interviewService from "../services/interview.service";

const sendError = (res: Response, error: any) =>
  res.status(error.statusCode || error.status || 500).json({ success: false, message: error.message || "Interview request failed" });

export const start = async (req: AuthRequest, res: Response) => {
  try {
    const interview = await interviewService.startInterview(
      req.userId!,
      String(req.body.resumeText || ""),
      String(req.body.jobDescription || "")
    );
    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    sendError(res, error);
  }
};

export const answer = async (req: AuthRequest, res: Response) => {
  try {
    const interview = await interviewService.answerInterview(req.userId!, req.params.id as string, String(req.body.answer || ""));
    res.json({ success: true, data: interview });
  } catch (error) {
    sendError(res, error);
  }
};

export const getOne = async (req: AuthRequest, res: Response) => {
  try {
    const interview = await interviewService.getInterviewById(req.userId!, req.params.id as string);
    res.json({ success: true, data: interview });
  } catch (error) {
    sendError(res, error);
  }
};