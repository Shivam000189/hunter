import { z } from "zod";

export const createJobSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  jobUrl: z.string().url().optional(),
  appliedDate: z.string(),
  notes: z.string().optional(),
  resumeId: z.string().optional(),
});