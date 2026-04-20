import express from "express";
import cors from "cors";
import prisma from "./config/prisma";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.use("/api/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);


app.get("/", (_req, res) => {
  res.send("API running...");
});

export default app;