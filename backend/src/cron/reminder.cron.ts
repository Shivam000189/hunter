import cron from "node-cron";
import { triggerReminders } from "../services/reminder.service";

cron.schedule("0 9 * * *", async () => {
  console.log("Running reminder cron...");
  await triggerReminders();
});