import prisma from "../config/prisma";
import { JobStatus } from "@prisma/client";

// main analytics
export const getAnalytics = async (userId: string) => {
  const jobs = await prisma.job.findMany({
    where: { userId },
    select: {
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalApplications = jobs.length;

  // status breakdown
  const statusBreakdown = {
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  jobs.forEach((job) => {
    const key = job.status.toLowerCase() as keyof typeof statusBreakdown;
    statusBreakdown[key]++;
  });

  //Rates
  const responses =
    statusBreakdown.interview +
    statusBreakdown.offer +
    statusBreakdown.rejected;

  const responseRate = totalApplications
    ? (responses / totalApplications) * 100
    : 0;

  const offerRate = totalApplications
    ? (statusBreakdown.offer / totalApplications) * 100
    : 0;

  // weekly application
  const weeklyMap: Record<string, number> = {};

  jobs.forEach((job) => {
    const date = new Date(job.createdAt);

    const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;

    weeklyMap[week] = (weeklyMap[week] || 0) + 1;
  });

  const weeklyApplications = Object.entries(weeklyMap).map(
    ([week, count]) => ({
      week,
      count,
    })
  );

  // avg day to res
  const responseTimes: number[] = [];

  jobs.forEach((job) => {
    if (job.status !== JobStatus.APPLIED) {
      const diff =
        (new Date(job.updatedAt).getTime() -
          new Date(job.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);

      responseTimes.push(diff);
    }
  });

  const avgDaysToResponse =
    responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) /
        responseTimes.length
      : 0;

  return {
    totalApplications,
    statusBreakdown,
    responseRate: Number(responseRate.toFixed(1)),
    offerRate: Number(offerRate.toFixed(1)),
    weeklyApplications,
    avgDaysToResponse: Math.round(avgDaysToResponse),
  };
};


export const getWeeklyAnalytics = async (
  userId: string,
  weeks: number
) => {
  const jobs = await prisma.job.findMany({
    where: { userId },
    select: { createdAt: true },
  });

  const weeklyMap: Record<string, number> = {};

  jobs.forEach((job) => {
    const date = new Date(job.createdAt);
    const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    weeklyMap[week] = (weeklyMap[week] || 0) + 1;
  });

  return Object.entries(weeklyMap)
    .map(([week, count]) => ({ week, count }))
    .slice(-weeks);
};


function getWeekNumber(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff =
    (date.getTime() - start.getTime()) /
    (1000 * 60 * 60 * 24);
  return Math.ceil((diff + start.getDay() + 1) / 7);
}