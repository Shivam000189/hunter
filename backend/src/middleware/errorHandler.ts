import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, _req: any, res: any, _next: any) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
  });
};