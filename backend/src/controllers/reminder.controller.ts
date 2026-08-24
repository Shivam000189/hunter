import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as reminderService from "../services/reminder.service";

export const getPending = async (req: AuthRequest, res: Response) => {
  const jobs = await reminderService.getPendingReminders(req.userId!);

  res.json({
    success: true,
    data: jobs.map((job) => ({
      _id: job.id,
      company: job.company,
      role: job.role,
      appliedDate: job.appliedDate,
    })),
  });
};

export const acknowledge = async (req: AuthRequest, res: Response) => {
  const result = await reminderService.acknowledgeReminders(req.userId!);

  res.json({ success: true, dismissed: result.count });
};

// get logs
export const getLogs = async (req: AuthRequest, res: Response) => {
  const logs = await reminderService.getLogs(req.userId!);

  res.json({
    success: true,
    data: logs.map((l) => ({
      _id: l.id,
      jobId: l.jobId,
      company: l.job.company,
      sentAt: l.sentAt,
      nextReminder: l.nextReminder,
    })),
  });
};

export const getSettings = async (
  req: AuthRequest,
  res: Response
) => {
  const settings = await reminderService.getSettings(req.userId!);

  res.json({
    success: true,
    data: {
      staleDays: settings.staleDays,
      enabled: settings.enabled,
    },
  });
};

// trigger - admin 
export const trigger = async (req: AuthRequest, res: Response) => {
  const result = await reminderService.triggerReminders();

  res.json({
    success: true,
    data: result,
  });
};


export const updateSettings = async (
  req: AuthRequest,
  res: Response
) => {
  const settings = await reminderService.updateSettings(
    req.userId!,
    req.body
  );

  res.json({
    success: true,
    data: {
      staleDays: settings.staleDays,
      enabled: settings.enabled,
    },
  });
};
