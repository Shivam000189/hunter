import { z } from "zod";

export const createApplicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected"]).optional(),
  appliedDate: z.string().optional(),
  notes: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(["Applied", "Interview", "Offer", "Rejected"]),
});