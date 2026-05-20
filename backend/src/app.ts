import express from "express";
import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import aiRoutes from "./routes/ai.routes";
import resumeRoutes from "./routes/resume.routes";
import analyticsRoutes from "./routes/analytics.routes";
import reminderRoutes from "./routes/reminder.routes";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (env.corsOrigins.length === 0) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (env.corsOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/resumes", resumeRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/reminders", reminderRoutes);

app.get("/", (_req, res) => {
  res.send("API running...");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
