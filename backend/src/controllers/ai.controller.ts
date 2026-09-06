import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as aiService from "../services/ai.service";
import { asyncHandler } from "../utils/asyncHandler";

// POST /ai/cover-letter
export const generate = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await aiService.generateCoverLetter(req.userId!, req.body) as any;

  res.json({
    success: true,
    data: {
      _id: result.id,
      content: result.content,
      jobId: result.jobId,
      userId: result.userId,
      generatedAt: result.generatedAt,
    },
  });
});

// GET /ai/cover-letters
export const getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const letters = await aiService.getCoverLetters(req.userId!);

  res.json({
    success: true,
    data: letters.map((l) => ({
      _id: l.id,
      content: l.content,
      jobId: l.jobId,
      generatedAt: l.generatedAt,
    })),
  });
});

// GET /ai/cover-letters/:id
export const getOne = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const letter = await aiService.getCoverLetterById(req.userId!, id);

  res.json({
    success: true,
    data: {
      _id: letter.id,
      content: letter.content,
      jobId: letter.jobId,
      generatedAt: letter.generatedAt,
    },
  });
});

export const resumeFeedback = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await aiService.getResumeFeedback(req.userId!, req.body);

  res.json({
    success: true,
    data,
  });
});

export const resumeMatch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await aiService.getResumeMatchScore(req.userId!, req.body);

  res.json({
    success: true,
    data,
  });
});

export const generateColdEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await aiService.generateColdEmail(req.userId!, req.body) as any;

  res.json({
    success: true,
    data: {
      _id: result.id,
      content: result.content,
      jobId: result.jobId,
      userId: result.userId,
      generatedAt: result.generatedAt,
    },
  });
});
