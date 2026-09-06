import { beforeEach, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { mockPrisma, resetPrismaMocks } from "../helpers/prismaMock";

vi.mock("../../src/config/prisma", () => ({
  default: mockPrisma,
}));

vi.mock("../../src/services/github", () => ({
  scrapeGithub: vi.fn(),
}));

import { scrapeGithub } from "../../src/services/github";
import { githubRouter } from "../../src/controllers/github.controller";

describe("github controller", () => {
  beforeEach(() => {
    resetPrismaMocks();
    vi.clearAllMocks();
  });

  const mockRes = () => {
    const res: Partial<Response> = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res as Response & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
  };

  it("returns 400 if github username is invalid", async () => {
    const req = { body: { githubUsername: "a" } } as Request;
    const res = mockRes();

    await githubRouter(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid github username" });
  });

  it("returns 500 when scrapeGithub fails on network/rate-limit error", async () => {
    const req = { body: { githubUsername: "validuser" } } as Request;
    const res = mockRes();

    vi.mocked(scrapeGithub).mockRejectedValue(new Error("GitHub API rate limit exceeded"));

    await githubRouter(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "GitHub API rate limit exceeded",
    });
  });

  it("returns 400 when Prisma throws PrismaClientKnownRequestError", async () => {
    const req = { body: { githubUsername: "validuser" } } as Request;
    const res = mockRes();

    vi.mocked(scrapeGithub).mockResolvedValue([{ name: "repo1", starCount: 5 }]);
    const prismaError = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "6.0.0",
    });
    mockPrisma.interview.create.mockRejectedValue(prismaError);

    await githubRouter(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Unique constraint failed" });
  });

  it("creates interview and returns success on valid request", async () => {
    const req = { body: { githubUsername: "validuser" } } as Request;
    const res = mockRes();

    vi.mocked(scrapeGithub).mockResolvedValue([{ name: "repo1", starCount: 5 }]);
    mockPrisma.interview.create.mockResolvedValue({ id: "interview-123" });

    await githubRouter(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      id: "interview-123",
    });
  });
});
