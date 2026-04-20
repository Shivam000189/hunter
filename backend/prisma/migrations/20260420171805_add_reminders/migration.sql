/*
  Warnings:

  - You are about to drop the column `enable` on the `ReminderSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReminderSettings" DROP COLUMN "enable",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
