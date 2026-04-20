import prisma from "../config/prisma";
import { JobStatus } from "@prisma/client";

export const createJob = async (userId: string, data: any) => {
  return prisma.job.create({
    data: {
        company: data.company,
        role: data.role,
        jobUrl: data.jobUrl,
        appliedDate: new Date(data.appliedDate),
        notes: data.notes,
        resumeId: data.resumeId,
        userId,
        status: "APPLIED",
        },
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
    skip: (page - 1) * limit,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.job.count({ where });

  return { jobs, total };
};

export const getJobById = async (userId: string, id: string) => {
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job || job.userId !== userId) {
    throw { status: 403, message: "Not your job application" };
  }

  return job;
};

export const updateJob = async (userId: string, id: string, data: any) => {
  await getJobById(userId, id);

  return prisma.job.update({
    where: { id },
    data,
  });
};



export const updateStatus = async (
  userId: string,
  id: string,
  status: string
) => {
  await getJobById(userId, id);

  return prisma.job.update({
    where: { id },
    data: {
      status: status.toUpperCase() as JobStatus, // ✅ FIX
    },
  });
};

export const deleteJob = async (userId: string, id: string) => {
  await getJobById(userId, id);

  return prisma.job.delete({
    where: { id },
  });
};