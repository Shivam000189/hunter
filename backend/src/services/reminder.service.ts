import prisma from "../config/prisma";
import transporter from "../config/mail";
import { z } from "zod";

const oneDayAgo = () => new Date(Date.now() - 24 * 60 * 60 * 1000);

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getPendingReminders = async (userId: string) => {
  return prisma.job.findMany({
    where: {
      userId,
      status: "APPLIED",
      appliedDate: { lte: oneDayAgo() },
      OR: [
        { reminderSeenAt: null },
        { reminderSeenAt: { lt: startOfToday() } },
      ],
    },
    orderBy: { appliedDate: "asc" },
    select: {
      id: true,
      company: true,
      role: true,
      appliedDate: true,
    },
  });
};

export const acknowledgeReminders = async (userId: string) => {
  return prisma.job.updateMany({
    where: {
      userId,
      status: "APPLIED",
      appliedDate: { lte: oneDayAgo() },
      OR: [
        { reminderSeenAt: null },
        { reminderSeenAt: { lt: startOfToday() } },
      ],
    },
    data: { reminderSeenAt: new Date() },
  });
};

export const triggerReminders = async () => {
  const users = await prisma.user.findMany({
    include: { reminderSettings: true },
  });

  let totalEmails = 0;
  let totalJobs = 0;

  for (const user of users) {
    // Guest accounts have fake inboxes, never email them
    if (user.email.endsWith("@guest.local")) continue;

    let settings = user.reminderSettings;

    if (!settings) {
        settings = await prisma.reminderSettings.create({
        data: {
            userId: user.id,
            enabled: true,
            staleDays: 7,
        },
        });
    }

    if (!settings.enabled) continue;

    // ✅ USE settings (not user.reminderSettings)
    const staleDays = settings.staleDays;

    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - staleDays);

    // Skip jobs already reminded inside their nextReminder window,
    // otherwise every daily run re-emails the same stale jobs forever
    const snoozedLogs = await prisma.reminderLog.findMany({
      where: {
        userId: user.id,
        nextReminder: { gt: new Date() },
      },
      select: { jobId: true },
    });
    const snoozedJobIds = snoozedLogs.map((log) => log.jobId);

    const jobs = await prisma.job.findMany({
      where: {
        userId: user.id,
        updatedAt: { lt: staleDate },
        status: { not: "REJECTED" },
        ...(snoozedJobIds.length > 0 && { id: { notIn: snoozedJobIds } }),
      },
    });

    for (const job of jobs) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Follow up: ${job.company}`,
          text: `It's been a while since you applied to ${job.company}. Consider following up.`,
        });

        totalEmails++;
      } catch (error) {
        console.error("Email failed:", error);
      }

      totalJobs++;

      await prisma.reminderLog.create({
        data: {
          jobId: job.id,
          userId: user.id,
          nextReminder: new Date(
            Date.now() + staleDays * 24 * 60 * 60 * 1000
          ),
        },
      });
    }
  }

  return {
    staleJobsFound: totalJobs,
    emailsSent: totalEmails,
  };
};


export const getLogs = async (userId: string) => {
  return prisma.reminderLog.findMany({
    where: { userId },
    include: { job: true },
    orderBy: { sentAt: "desc" },
  });
};

export const getSettings = async (userId: string) => {
  return prisma.reminderSettings.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      enabled: true,
      staleDays: 7,
    },
  });
};

// update settings
const updateSettingsSchema = z.object({
  staleDays: z.number().int().min(1).max(90).optional(),
  enabled: z.boolean().optional(),
});

export const updateSettings = async (
  userId: string,
  data: any
) => {
  const parsed = updateSettingsSchema.safeParse(data);

  if (!parsed.success) {
    throw { status: 400, message: "Invalid reminder settings" };
  }

  const updateData: { staleDays?: number; enabled?: boolean } = {};
  if (parsed.data.staleDays !== undefined) updateData.staleDays = parsed.data.staleDays;
  if (parsed.data.enabled !== undefined) updateData.enabled = parsed.data.enabled;

  return prisma.reminderSettings.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      ...updateData,
    },
  });
};
