import { JobStatus } from "@prisma/client";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateToken } from "../../src/utils/jwt";
import { mockPrisma, mockTx, resetPrismaMocks } from "../helpers/prismaMock";

vi.mock("../../src/config/prisma", () => ({
  default: mockPrisma,
}));

import app from "../../src/app";

describe("job routes", () => {
  const token = generateToken("user-1");

  beforeEach(() => {
    resetPrismaMocks();
  });

  it("requires authentication", async () => {
    const response = await request(app).get("/api/v1/jobs");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });

  it("creates a job through the Express route", async () => {
    const createdAt = new Date("2026-07-01T00:00:00.000Z");
    mockPrisma.resume.findUnique.mockResolvedValue({ userId: "user-1" });
    mockTx.job.create.mockResolvedValue({
      id: "job-1",
      company: "OpenAI",
      role: "Backend Engineer",
      status: JobStatus.APPLIED,
      appliedDate: new Date("2026-07-01T00:00:00.000Z"),
      createdAt,
      resumeId: "resume-1",
      userId: "user-1",
    });
    mockTx.resume.update.mockResolvedValue({});

    const response = await request(app)
      .post("/api/v1/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        company: "OpenAI",
        role: "Backend Engineer",
        jobUrl: "https://example.com/jobs/1",
        appliedDate: "2026-07-01",
        notes: "Apply soon",
        resumeId: "resume-1",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        _id: "job-1",
        company: "OpenAI",
        role: "Backend Engineer",
        status: "applied",
        appliedDate: "2026-07-01T00:00:00.000Z",
        createdAt: createdAt.toISOString(),
      },
    });
  });

  it("lists jobs with pagination metadata", async () => {
    const createdAt = new Date("2026-07-01T00:00:00.000Z");
    mockPrisma.job.findMany.mockResolvedValue([
      {
        id: "job-1",
        company: "OpenAI",
        role: "Backend Engineer",
        status: JobStatus.APPLIED,
        createdAt,
        updatedAt: createdAt,
        appliedDate: createdAt,
        userId: "user-1",
        resumeId: null,
        notes: null,
        jobUrl: null,
        resume: null,
      },
    ]);
    mockPrisma.job.count.mockResolvedValue(1);

    const response = await request(app)
      .get("/api/v1/jobs?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.total).toBe(1);
    expect(response.body.page).toBe(1);
    expect(response.body.data).toHaveLength(1);
  });

  it("validates status updates before calling the service", async () => {
    const response = await request(app)
      .patch("/api/v1/jobs/job-1/status")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "not-a-real-status" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid status value",
    });
    expect(mockPrisma.job.findUnique).not.toHaveBeenCalled();
  });

  it("clips a job via quick-add defaulting appliedDate when not provided", async () => {
    const createdAt = new Date("2026-07-01T00:00:00.000Z");
    mockTx.job.create.mockResolvedValue({
      id: "job-quick-1",
      company: "Stripe",
      role: "Staff Infrastructure Engineer",
      status: JobStatus.APPLIED,
      appliedDate: createdAt,
      createdAt,
      resumeId: null,
      userId: "user-1",
      jobUrl: "https://stripe.com/jobs/1",
      notes: "Clipped via Hunter extension",
    });

    const response = await request(app)
      .post("/api/v1/jobs/quick-add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        company: "Stripe",
        role: "Staff Infrastructure Engineer",
        jobUrl: "https://stripe.com/jobs/1",
        notes: "Clipped via Hunter extension",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Job clipped successfully");
    expect(response.body.data.company).toBe("Stripe");
    expect(response.body.data.role).toBe("Staff Infrastructure Engineer");
  });

  it("rejects quick-add when required company or role is missing", async () => {
    const response = await request(app)
      .post("/api/v1/jobs/quick-add")
      .set("Authorization", `Bearer ${token}`)
      .send({
        role: "Frontend Engineer",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
