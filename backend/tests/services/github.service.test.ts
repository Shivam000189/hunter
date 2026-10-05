import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPrisma, resetPrismaMocks } from "../helpers/prismaMock";

vi.mock("../../src/config/prisma", () => ({
  default: mockPrisma,
}));

vi.mock("axios", () => ({
  default: {
    request: vi.fn(),
  },
}));

import axios from "axios";
import { getFreshGithubData } from "../../src/services/github";

describe("github service caching and refresh", () => {
  beforeEach(() => {
    resetPrismaMocks();
    vi.clearAllMocks();
  });

  it("returns null if user has no github username", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      githubUsername: null,
      githubData: null,
      githubFetchedAt: null,
    });

    const data = await getFreshGithubData("user-1");
    expect(data).toBeNull();
  });

  it("returns cached github data when cache is fresh (<24h)", async () => {
    const cachedRepos = [
      { name: "repo1", fullName: "user/repo1", description: "desc", starCount: 10 },
    ];
    mockPrisma.user.findUnique.mockResolvedValue({
      githubUsername: "Shivam000189",
      githubData: cachedRepos,
      githubFetchedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    });

    const data = await getFreshGithubData("user-1");
    expect(data).toEqual(cachedRepos);
    expect(axios.request).not.toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it("fetches fresh data and updates cache when stale (>24h)", async () => {
    const oldRepos = [{ name: "old", fullName: "user/old", description: "old", starCount: 1 }];
    const freshApiData = [
      { name: "new-repo", full_name: "user/new-repo", description: "fresh", stargazers_count: 20 },
    ];

    mockPrisma.user.findUnique.mockResolvedValue({
      githubUsername: "Shivam000189",
      githubData: oldRepos,
      githubFetchedAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
    });

    vi.mocked(axios.request).mockResolvedValue({ data: freshApiData });
    mockPrisma.user.update.mockResolvedValue({});

    const data = await getFreshGithubData("user-1");

    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://api.github.com/users/Shivam000189/repos",
      })
    );
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        githubData: [
          {
            name: "new-repo",
            fullName: "user/new-repo",
            description: "fresh",
            starCount: 20,
          },
        ],
        githubFetchedAt: expect.any(Date),
      },
    });
    expect(data).toEqual([
      {
        name: "new-repo",
        fullName: "user/new-repo",
        description: "fresh",
        starCount: 20,
      },
    ]);
  });

  it("falls back to cached data when refresh fails", async () => {
    const cachedRepos = [{ name: "cached", fullName: "user/cached", description: "c", starCount: 2 }];
    mockPrisma.user.findUnique.mockResolvedValue({
      githubUsername: "Shivam000189",
      githubData: cachedRepos,
      githubFetchedAt: null, // stale/unfetched
    });

    vi.mocked(axios.request).mockRejectedValue(new Error("Network error"));

    const data = await getFreshGithubData("user-1");
    expect(data).toEqual(cachedRepos);
  });
});
