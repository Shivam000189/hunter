import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateToken } from "../../src/utils/jwt";
import { mockPrisma, resetPrismaMocks } from "../helpers/prismaMock";

vi.mock("../../src/config/prisma", () => ({
  default: mockPrisma,
}));

import app from "../../src/app";

describe("ai routes", () => {
  const token = generateToken("user-1");

  beforeEach(() => {
    resetPrismaMocks();
  });

  it("handles service rejection in getAll cover letters via global error handler", async () => {
    mockPrisma.coverLetter.findMany.mockRejectedValue(new Error("Cover letters query failed"));

    const response = await request(app)
      .get("/api/v1/ai/cover-letters")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Cover letters query failed",
    });
  });

  it("handles 403 when getCoverLetterById finds letter belonging to someone else", async () => {
    mockPrisma.coverLetter.findUnique.mockResolvedValue({
      id: "letter-1",
      userId: "other-user",
      content: "Cover letter text",
    });

    const response = await request(app)
      .get("/api/v1/ai/cover-letters/letter-1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      message: "Not allowed",
    });
  });
});
