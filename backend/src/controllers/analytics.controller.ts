import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as analyticsService from "../services/analytics.service";

// /analytics
export const getAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  const data = await analyticsService.getAnalytics(
    req.userId!
  );

  res.json({
    success: true,
    data,
  });
};

//  /analytics/weekly
export const getWeekly = async (
  req: AuthRequest,
  res: Response
) => {
  const weeks = Number(req.query.weeks) || 8;

  const data = await analyticsService.getWeeklyAnalytics(
    req.userId!,
    weeks
  );

  res.json({
    success: true,
    data,
  });
};