import { JobStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPrisma, mockTx, resetPrismaMocks } from "../helpers/prismaMock";

vi.mock("../../src/config/prisma", () => ({
  default: mockPrisma,
}));

import {
  createJob,
  getJobById,
  updateJob,
  updateStatus,
} from "../../src/services/job.service";

describe("job.service", () => {
  beforeEach(() => {
    resetPrismaMocks();
  });

  it("creates a job and increments resume usage metrics", async () => {
    const createdJob = {
      id: "job-1",
      company: "OpenAI",
      role: "Backend Engineer",
      jobUrl: "https://example.com/jobs/1",
      appliedDate: new Date("2026-07-01T00:00:00.000Z"),
      notes: "Apply soon",
      resumeId: "resume-1",
      userId: "user-1",
      status: JobStatus.APPLIED,
    };

    mockPrisma.resume.findUnique.mockResolvedValue({ userId: "user-1" });
    mockTx.job.create.mockResolvedValue(createdJob);
    mockTx.resume.update.mockResolvedValue({});

    const result = await createJob("user-1", {
      company: "OpenAI",
      role: "Backend Engineer",
      jobUrl: "https://example.com/jobs/1",
      appliedDate: "2026-07-01",
      notes: "Apply soon",
      resumeId: "resume-1",
    });

    expect(mockTx.job.create).toHaveBeenCalledWith({
      data: {
        company: "OpenAI",
        role: "Backend Engineer",
        jobUrl: "https://example.com/jobs/1",
        appliedDate: new Date("2026-07-01"),
        notes: "Apply soon",
        resumeId: "resume-1",
        userId: "user-1",
        status: JobStatus.APPLIED,
      },
    });
    expect(mockTx.resume.update).toHaveBeenCalledWith({
      where: { id: "resume-1" },
      data: {
        totalUsed: { increment: 1 },
      },
    });
    expect(result).toBe(createdJob);
  });

  it("rejects access to jobs owned by another user", async () => {
    mockPrisma.job.findUnique.mockResolvedValue({
      id: "job-1",
      userId: "someone-else",
    });

    await expect(getJobById("user-1", "job-1")).rejects.toMatchObject({
      statusCode: 403,
      message: "Not your job application",
    });
  });

  it("moves usage metrics when a job switches resumes", async () => {
    mockPrisma.job.findUnique.mockResolvedValue({
      id: "job-1",
      userId: "user-1",
      status: JobStatus.INTERVIEW,
      resumeId: "resume-old",
      company: "OpenAI",
      role: "Backend Engineer",
      createdAt: new Date("2026-07-01T00:00:00.000Z"),
      updatedAt: new Date("2026-07-01T00:00:00.000Z"),
    });
    mockPrisma.resume.findUnique.mockResolvedValue({ userId: "user-1" });
    mockTx.job.update.mockResolvedValue({
      id: "job-1",
      resumeId: "resume-new",
      status: JobStatus.INTERVIEW,
      resume: {
        id: "resume-new",
        versionName: "v2",
      },
    });

    await updateJob("user-1", "job-1", { resumeId: "resume-new" });

    expect(mockTx.resume.update).toHaveBeenNthCalledWith(1, {
      where: { id: "resume-old" },
      data: {
        totalUsed: { increment: -1 },
        interviews: { increment: -1 },
      },
    });
    expect(mockTx.resume.update).toHaveBeenNthCalledWith(2, {
      where: { id: "resume-new" },
      data: {
        totalUsed: { increment: 1 },
        interviews: { increment: 1 },
      },
    });
  });

  it("updates interview to offer status by adjusting metrics", async () => {
    mockPrisma.job.findUnique.mockResolvedValue({
      id: "job-1",
      userId: "user-1",
      status: JobStatus.INTERVIEW,
      resumeId: "resume-1",
      resume: {
        id: "resume-1",
        versionName: "v1",
      },
    });
    mockTx.job.update.mockResolvedValue({
      id: "job-1",
      status: JobStatus.OFFER,
      updatedAt: new Date("2026-07-03T00:00:00.000Z"),
      resume: {
        id: "resume-1",
        versionName: "v1",
      },
    });

    const result = await updateStatus("user-1", "job-1", "offer");

    expect(mockTx.resume.update).toHaveBeenNthCalledWith(1, {
      where: { id: "resume-1" },
      data: {
        interviews: { increment: -1 },
      },
    });
    expect(mockTx.resume.update).toHaveBeenNthCalledWith(2, {
      where: { id: "resume-1" },
      data: {
        offers: { increment: 1 },
      },
    });
    expect(result.status).toBe(JobStatus.OFFER);
  });
});
