-- Resume intelligence metrics
ALTER TABLE "Resume" ADD COLUMN "totalUsed" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Resume" ADD COLUMN "interviews" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Resume" ADD COLUMN "offers" INTEGER NOT NULL DEFAULT 0;

-- Avoid FK failures from older rows that stored arbitrary resumeId values.
UPDATE "Job"
SET "resumeId" = NULL
WHERE "resumeId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "Resume" WHERE "Resume"."id" = "Job"."resumeId"
  );

-- Link jobs to resumes so performance can be derived and protected by the DB.
ALTER TABLE "Job" ADD CONSTRAINT "Job_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill metrics from existing jobs.
UPDATE "Resume" r
SET
  "totalUsed" = COALESCE(stats."totalUsed", 0),
  "interviews" = COALESCE(stats."interviews", 0),
  "offers" = COALESCE(stats."offers", 0)
FROM (
  SELECT
    "resumeId",
    COUNT(*)::INTEGER AS "totalUsed",
    COUNT(*) FILTER (WHERE "status" = 'INTERVIEW')::INTEGER AS "interviews",
    COUNT(*) FILTER (WHERE "status" = 'OFFER')::INTEGER AS "offers"
  FROM "Job"
  WHERE "resumeId" IS NOT NULL
  GROUP BY "resumeId"
) stats
WHERE r."id" = stats."resumeId";
