ALTER TABLE "Interview" ADD COLUMN "userId" TEXT;
ALTER TABLE "Interview" ADD COLUMN "resumeText" TEXT;
ALTER TABLE "Interview" ADD COLUMN "jobDescription" TEXT;
ALTER TABLE "Interview" ADD COLUMN "questionSet" JSONB;
ALTER TABLE "Interview" ADD COLUMN "answerFeedback" JSONB;

ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Interview_userId_idx" ON "Interview"("userId");