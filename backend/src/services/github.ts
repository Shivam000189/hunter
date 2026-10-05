import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import prisma from "../config/prisma";

const proxy = process.env.HTTP_PROXY;

const agent = proxy ? new HttpsProxyAgent(proxy) : undefined;

export async function scrapeGithub(username: string) {
    const userRepos = await axios.request({url: `https://api.github.com/users/${username}/repos`, httpsAgent: agent, headers: { 'User-Agent': 'request' }});
    return userRepos.data.map((x: any) => ({
        description: x.description,
        name: x.name,
        fullName: x.full_name,
        starCount: x.stargazers_count
    }))
}

const GITHUB_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export type GithubRepoSummary = {
  description: string | null;
  name: string;
  fullName: string;
  starCount: number;
};

export const getFreshGithubData = async (userId: string): Promise<GithubRepoSummary[] | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubUsername: true, githubData: true, githubFetchedAt: true },
  });

  if (!user?.githubUsername) return null;

  const isStale =
    !user.githubFetchedAt || Date.now() - user.githubFetchedAt.getTime() > GITHUB_CACHE_TTL_MS;

  if (!isStale && user.githubData) {
    return user.githubData as unknown as GithubRepoSummary[];
  }

  try {
    const fresh = await scrapeGithub(user.githubUsername);
    await prisma.user.update({
      where: { id: userId },
      data: { githubData: fresh, githubFetchedAt: new Date() },
    });
    return fresh;
  } catch (err) {
    console.error("GitHub refresh failed, falling back to cached data:", err);
    return (user.githubData as unknown as GithubRepoSummary[]) || null;
  }
};