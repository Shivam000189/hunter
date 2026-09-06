import { Request, Response } from "express";
import { registerUser, loginUser, createGuestUser, getMe } from "../services/auth.service";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

// Register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await registerUser(name, email, password);

  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      token,
    },
  });
});

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);
  const token = generateToken(user.id);

  res.json({
    success: true,
    token,
    expiresIn: "24h",
    user: {
      _id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Guest Login
export const guestLogin = asyncHandler(async (_req: Request, res: Response) => {
  const user = await createGuestUser();
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    token,
    expiresIn: "24h",
    user: {
      _id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Get me 
export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getMe(req.userId!);

  res.json({
    success: true,
    data: {
      _id: user?.id,
      name: user?.name,
      email: user?.email,
      googleId: user?.googleId,
      createdAt: user?.createdAt,
    },
  });
});

// Logout
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
