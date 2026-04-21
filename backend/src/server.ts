import dotenv from "dotenv";
dotenv.config();
import "./cron/reminder.cron";

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});