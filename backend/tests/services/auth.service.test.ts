import { beforeEach, describe, expect, it, vi } from "vitest";
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

import { getMe, loginUser, registerUser, updateGithubUsername } from "../../src/services/auth.service";

describe("auth.service", () => {
  beforeEach(() => {
    resetPrismaMocks();
    resetHashMocks();
  });

  it("registers a new user with a hashed password", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue("hashed-password");
    mockPrisma.user.create.mockResolvedValue({
      id: "user-1",
      name: "Shivam",
      email: "shivam@example.com",
      password: "hashed-password",
    });

    const user = await registerUser(
      "Shivam",
      "shivam@example.com",
      "plain-password"
    );

    expect(mockHashPassword).toHaveBeenCalledWith("plain-password");
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "Shivam",
        email: "shivam@example.com",
        password: "hashed-password",
      },
    });
    expect(user.email).toBe("shivam@example.com");
  });

  it("rejects duplicate registrations", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "existing-user" });

    await expect(
      registerUser("Shivam", "shivam@example.com", "plain-password")
    ).rejects.toMatchObject({
      status: 409,
      message: "Email already exists",
    });
  });

  it("returns the user when credentials are valid", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "shivam@example.com",
      password: "hashed-password",
    });
    mockComparePassword.mockResolvedValue(true);

    const user = await loginUser("shivam@example.com", "plain-password");

    expect(mockComparePassword).toHaveBeenCalledWith(
      "plain-password",
      "hashed-password"
    );
    expect(user.id).toBe("user-1");
  });

  it("rejects invalid passwords", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "shivam@example.com",
      password: "hashed-password",
    });
    mockComparePassword.mockResolvedValue(false);

    await expect(
      loginUser("shivam@example.com", "wrong-password")
    ).rejects.toMatchObject({
      status: 400,
      message: "Invalid credentials",
    });
  });

  it("returns a safe user profile for getMe", async () => {
    const profile = {
      id: "user-1",
      name: "Shivam",
      email: "shivam@example.com",
      googleId: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    };
    mockPrisma.user.findUnique.mockResolvedValue(profile);

    await expect(getMe("user-1")).resolves.toEqual(profile);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        createdAt: true,
      },
    });
  });

  it("updates github username and resets githubFetchedAt to null", async () => {
    mockPrisma.user.update.mockResolvedValue({
      id: "user-1",
      githubUsername: "Shivam000189",
      githubFetchedAt: null,
    });

    const result = await updateGithubUsername(
      "user-1",
      "https://github.com/Shivam000189/"
    );

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        githubUsername: "Shivam000189",
        githubFetchedAt: null,
      },
    });
    expect(result.githubUsername).toBe("Shivam000189");
  });

  it("throws 400 when updating with empty github username", async () => {
    await expect(updateGithubUsername("user-1", "   ")).rejects.toMatchObject({
      status: 400,
      message: "GitHub username is required",
    });
  });
});
