import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as aiService from "../services/ai.service";

// POST /ai/cover-letter
export const generate = async (req: AuthRequest, res: Response) => {
  try {
    const result = await aiService.generateCoverLetter(
      req.userId!,
      req.body
    );

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
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /ai/cover-letters
export const getAll = async (req: AuthRequest, res: Response) => {
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
};

// GET /ai/cover-letters/:id
export const getOne = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const letter = await aiService.getCoverLetterById(
      req.userId!,
      id
    );

    res.json({
      success: true,
      data: {
        _id: letter.id,
        content: letter.content,
        jobId: letter.jobId,
        generatedAt: letter.generatedAt,
      },
    });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};