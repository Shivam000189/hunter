-- Track when the user last saw the daily reminder for an applied job.
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "reminderSeenAt" TIMESTAMP(3);