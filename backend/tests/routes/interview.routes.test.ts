import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateToken } from "../../src/utils/jwt";
import { mockPrisma, resetPrismaMocks } from "../helpers/prismaMock";

vi.mock("../../src/config/prisma", () => ({
  default: mockPrisma,
}));

import app from "../../src/app";

describe("interview routes", () => {
  const token = generateToken("user-1");

  beforeEach(() => {
    resetPrismaMocks();
  });

  it("handles 404 when interview is not found", async () => {
    mockPrisma.interview.findFirst.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/v1/interviews/interview-1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Interview not found",
    });
  });

  it("handles validation error (status 400) when answer is empty", async () => {
    const response = await request(app)
      .post("/api/v1/interviews/interview-1/answer")
      .set("Authorization", `Bearer ${token}`)
      .send({ answer: "   " });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Answer is required",
    });
  });
});
