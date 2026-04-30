import prisma from "../config/prisma";
import { JobStatus } from "@prisma/client";
import { AppError } from "../utils/AppError";

const countedStatusFields: Partial<Record<JobStatus, "interviews" | "offers">> = {
  [JobStatus.INTERVIEW]: "interviews",
  [JobStatus.OFFER]: "offers",
};

const resumeMetricDelta = (
  status: JobStatus,
  direction: 1 | -1,
  includeUsage = false
) => {
  const data: any = {};
  const statusField = countedStatusFields[status];

  if (includeUsage) {
    data.totalUsed = { increment: direction };
  }

  if (statusField) {
    data[statusField] = { increment: direction };
  }

  return data;
};

const updateResumeMetrics = async (
  tx: any,
  resumeId: string,
  status: JobStatus,
  direction: 1 | -1,
  includeUsage = false
) => {
  const data = resumeMetricDelta(status, direction, includeUsage);

  if (Object.keys(data).length === 0) {
    return;
  }

  await tx.resume.update({
    where: { id: resumeId },
    data,
  });
};

const ensureResumeBelongsToUser = async (userId: string, resumeId?: string) => {
  if (!resumeId) return;

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: { userId: true },
  });

  if (!resume || resume.userId !== userId) {
    throw new AppError("Resume not found", 404);
  }
};

export const createJob = async (userId: string, data: any) => {
  await ensureResumeBelongsToUser(userId, data.resumeId);

  return prisma.$transaction(async (tx) => {
    const job = await tx.job.create({
      data: {
        company: data.company,
        role: data.role,
        jobUrl: data.jobUrl,
        appliedDate: new Date(data.appliedDate),
        notes: data.notes,
        resumeId: data.resumeId,
        userId,
        status: JobStatus.APPLIED,
      },
    });

    if (job.resumeId) {
      await updateResumeMetrics(tx, job.resumeId, job.status, 1, true);
    }

    return job;
  });
};

export const getJobs = async (userId: string, query: any) => {
  const { status, page = 1, limit = 10 } = query;

  const where: any = { userId };

  if (status) {
    where.status = status.toUpperCase();
  }

  const jobs = await prisma.job.findMany({
    where,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    include: {
      resume: {
        select: {
          id: true,
          versionName: true,
        },
      },
    },
  });

  const total = await prisma.job.count({ where });

  return { jobs, total };
};

export const getJobById = async (userId: string, id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      resume: {
        select: {
          id: true,
          versionName: true,
        },
      },
    },
  });

  if (!job || job.userId !== userId) {
    throw new AppError("Not your job application", 403);
  }

  return job;
};

export const updateJob = async (
  userId: string,
  id: string,
  data: any
) => {
  const existingJob = await getJobById(userId, id);

  if (data.resumeId !== undefined && data.resumeId !== null) {
    await ensureResumeBelongsToUser(userId, data.resumeId);
  }

  return prisma.$transaction(async (tx) => {
    const nextResumeId =
      data.resumeId === undefined ? existingJob.resumeId : data.resumeId;

    if (existingJob.resumeId !== nextResumeId) {
      if (existingJob.resumeId) {
        await updateResumeMetrics(
          tx,
          existingJob.resumeId,
          existingJob.status,
          -1,
          true
        );
      }

      if (nextResumeId) {
        await updateResumeMetrics(tx, nextResumeId, existingJob.status, 1, true);
      }
    }

    return tx.job.update({
      where: { id },
      data: {
        ...(data.company && { company: data.company }),
        ...(data.role && { role: data.role }),
        ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.resumeId !== undefined && { resumeId: data.resumeId }),
      },
      include: {
        resume: {
          select: {
            id: true,
            versionName: true,
          },
        },
      },
    });
  });
};

export const updateStatus = async (
  userId: string,
  id: string,
  status: string
) => {
  const existingJob = await getJobById(userId, id);
  const nextStatus = status.toUpperCase() as JobStatus;

  return prisma.$transaction(async (tx) => {
    if (existingJob.resumeId && existingJob.status !== nextStatus) {
      await updateResumeMetrics(tx, existingJob.resumeId, existingJob.status, -1);
      await updateResumeMetrics(tx, existingJob.resumeId, nextStatus, 1);
    }

    return tx.job.update({
      where: { id },
      data: {
        status: nextStatus,
      },
      include: {
        resume: {
          select: {
            id: true,
            versionName: true,
          },
        },
      },
    });
  });
};

export const deleteJob = async (userId: string, id: string) => {
  const existingJob = await getJobById(userId, id);

  return prisma.$transaction(async (tx) => {
    if (existingJob.resumeId) {
      await updateResumeMetrics(
        tx,
        existingJob.resumeId,
        existingJob.status,
        -1,
        true
      );
    }

    return tx.job.delete({
      where: { id },
    });
  });
};
