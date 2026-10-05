import cron from "node-cron";
import { triggerReminders } from "../services/reminder.service";

cron.schedule("0 9 * * *", async () => {
  console.log("Running reminder cron...");
  try {
    await triggerReminders();
  } catch (error) {
    console.error("Reminder cron failed:", error);
  }
});