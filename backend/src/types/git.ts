import z from 'zod';

export const githubBody = z.object({
  githubUsername: z.string().min(2).max(39)
});
