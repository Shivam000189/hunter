import prisma from "../config/prisma";
import transporter from "../config/mail";

export const triggerReminders = async () => {
  const users = await prisma.user.findMany({
    include: { reminderSettings: true },
  });

  let totalEmails = 0;
  let totalJobs = 0;

  for (const user of users) {
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

    const jobs = await prisma.job.findMany({
      where: {
        userId: user.id,
        updatedAt: { lt: staleDate },
        status: { not: "REJECTED" },
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

      totalEmails++;
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

// update settings
export const updateSettings = async (
  userId: string,
  data: any
) => {
  return prisma.reminderSettings.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
};