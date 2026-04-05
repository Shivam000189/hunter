import express from "express";
import cors from "cors";
import applicationRoutes from "./routes/applicationRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/applications", applicationRoutes);

app.use("/applications", applicationRoutes);
app.use(errorHandler);

app.get("/", (_req, res) => {
  res.send("API running...");
});

export default app;