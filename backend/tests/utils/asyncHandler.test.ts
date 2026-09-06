import { describe, expect, it, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../src/utils/asyncHandler";

describe("asyncHandler utility", () => {
  it("executes an async handler and handles successful responses", async () => {
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    const handler = asyncHandler(async (_req, res) => {
      res.status(200).json({ success: true });
    });

    await handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(next).not.toHaveBeenCalled();
  });

  it("catches rejected promises and forwards errors to next()", async () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;
    const error = new Error("Async failure");

    const handler = asyncHandler(async () => {
      throw error;
    });

    handler(req, res, next);

    // Wait for promise resolution
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("catches synchronous exceptions and forwards errors to next()", async () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;
    const error = new Error("Sync failure");

    const handler = asyncHandler(() => {
      throw error;
    });

    handler(req, res, next);

    // Wait for promise resolution
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
