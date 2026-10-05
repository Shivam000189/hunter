/*
  Warnings:

  - Made the column `userId` on table `Interview` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "InterviewReadiness" AS ENUM ('READY', 'NEEDS_MORE_PREP', 'NOT_READY');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "answerFeedback" JSONB,
ADD COLUMN     "jobDescription" TEXT,
ADD COLUMN     "questionSet" JSONB,
ADD COLUMN     "readiness" "InterviewReadiness",
ADD COLUMN     "resumeText" TEXT,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "githubMetadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "resumeText" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubData" JSONB,
ADD COLUMN     "githubFetchedAt" TIMESTAMP(3),
ADD COLUMN     "githubUsername" TEXT;
