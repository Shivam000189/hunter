import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateToken } from "../../src/utils/jwt";
import { mockPrisma, resetPrismaMocks } from "../helpers/prismaMock";

vi.mock("../../src/config/prisma", () => ({
  default: mockPrisma,
}));

import app from "../../src/app";

describe("resume routes", () => {
  const token = generateToken("user-1");

  beforeEach(() => {
    resetPrismaMocks();
  });

  it("handles service rejection in getAll via global error middleware", async () => {
    mockPrisma.resume.findMany.mockRejectedValue(new Error("Database connection error"));

    const response = await request(app)
      .get("/api/v1/resumes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Database connection error",
    });
  });

  it("handles custom status error when fetching resume by id fails", async () => {
    mockPrisma.resume.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/v1/resumes/resume-999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: "Not allowed",
    });
  });
});
