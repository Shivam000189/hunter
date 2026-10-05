import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";

export const createGuestUser = async () => {
  return prisma.user.create({
    data: {
      name: "Guest User",
      email: `guest-${crypto.randomUUID()}@guest.local`,
    },
  });
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw {status:409, message:"Email already exists"};
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw { status: 404, message: "User not found" };
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw { status: 400, message: "Invalid credentials" };
  }

  return user;
};


export const getMe = async (userId:string) => {
  return prisma.user.findUnique({
    where: {id:userId},
    select:{
      id:true,
      name:true,
      email:true,
      googleId:true,
      createdAt:true
    },
  });
};

export const updateGithubUsername = async (userId: string, githubUsername: string) => {
  const clean = githubUsername
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/\/$/, "");

  if (!clean) throw { status: 400, message: "GitHub username is required" };

  return prisma.user.update({
    where: { id: userId },
    data: { githubUsername: clean, githubFetchedAt: null }, // null forces a fresh scrape next interview
  });
};