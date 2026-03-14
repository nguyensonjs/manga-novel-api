import type { NextFunction, Request, Response } from "express";

import { logger } from "@/utils/logger.ts";

let requestCounter = 0;

const createRequestId = (): string => {
  requestCounter += 1;
  return requestCounter.toString().padStart(4, "0");
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = performance.now();
  req.id = createRequestId();

  logger.requestStart(req.method, req.originalUrl, req.id);

  res.on("finish", () => {
    const durationMs = performance.now() - startTime;
    logger.request(req.method, req.originalUrl, res.statusCode, durationMs, req.id);
  });

  next();
};
