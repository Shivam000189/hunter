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

  it("retrieves interview session by ID with totalQuestions", async () => {
    mockPrisma.interview.findFirst.mockResolvedValue({
      id: "interview-1",
      userId: "user-1",
      status: "PENDING",
      conversation: [{ id: "m-1", message: "Tell me about your background", type: "ASSISTANT" }],
    });

    const response = await request(app)
      .get("/api/v1/interviews/interview-1")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe("interview-1");
    expect(response.body.data.totalQuestions).toBe(5);
  });

  it("successfully records an answer and returns updated interview state", async () => {
    const mockInterview = {
      id: "interview-1",
      userId: "user-1",
      status: "PENDING",
      questionSet: [
        { question: "Q1", idealAnswer: "Ans1", keywords: ["react", "typescript"] },
        { question: "Q2", idealAnswer: "Ans2", keywords: ["node", "express"] },
      ],
      conversation: [
        { id: "m-1", message: "Q1", type: "ASSISTANT" },
      ],
    };

    mockPrisma.interview.findFirst.mockResolvedValue(mockInterview);
    mockPrisma.message.create.mockResolvedValue({ id: "m-2", message: "I use react and typescript", type: "USER" });
    mockPrisma.interview.update.mockResolvedValue({ ...mockInterview });

    const response = await request(app)
      .post("/api/v1/interviews/interview-1/answer")
      .set("Authorization", `Bearer ${token}`)
      .send({ answer: "I use React and TypeScript in my day to day work" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.totalQuestions).toBe(5);
  });
});
