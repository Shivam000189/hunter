import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateToken } from "../../src/utils/jwt";
import { mockPrisma, resetPrismaMocks } from "../helpers/prismaMock";
import {
  mockComparePassword,
  mockHashPassword,
  resetHashMocks,
} from "../helpers/hashMock";

vi.mock("../../src/config/prisma", () => ({
  default: mockPrisma,
}));

vi.mock("../../src/utils/hash", () => ({
  hashPassword: mockHashPassword,
  comparePassword: mockComparePassword,
}));

import app from "../../src/app";

describe("auth routes", () => {
  beforeEach(() => {
    resetPrismaMocks();
    resetHashMocks();
  });

  it("registers a user and returns a token", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue("hashed-password");
    mockPrisma.user.create.mockResolvedValue({
      id: "user-1",
      name: "Shivam",
      email: "shivam@example.com",
      password: "hashed-password",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Shivam",
      email: "shivam@example.com",
      password: "plain-password",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("shivam@example.com");
    expect(response.body.data.token).toEqual(expect.any(String));
  });

  it("returns the authenticated profile from /me", async () => {
    const createdAt = new Date("2026-07-01T00:00:00.000Z");
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Shivam",
      email: "shivam@example.com",
      googleId: null,
      createdAt,
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${generateToken("user-1")}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        _id: "user-1",
        name: "Shivam",
        email: "shivam@example.com",
        googleId: null,
        createdAt: createdAt.toISOString(),
      },
    });
  });

  it("rejects invalid login credentials", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Shivam",
      email: "shivam@example.com",
      password: "hashed-password",
    });
    mockComparePassword.mockResolvedValue(false);

    const response = await request(app).post("/api/auth/login").send({
      email: "shivam@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid credentials",
    });
  });
});
