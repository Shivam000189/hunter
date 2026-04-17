import express from "express";
import cors from "cors";
import prisma from "./config/prisma";


const app = express();

app.use(cors());
app.use(express.json());


app.get("/test-db", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/", (_req, res) => {
  res.send("API running...");
});

export default app;