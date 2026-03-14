import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import multer from "multer";

import { HTTP_STATUS } from "@/constants/http-status.ts";
import { logger } from "@/utils/logger.ts";
import { HttpError } from "@/utils/http-error.ts";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof HttpError) {
    logger.warn(`${error.statusCode} ${error.message}`, req.id);
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    logger.warn(error.message, req.id);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    logger.warn("Invalid resource identifier", req.id);
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Invalid resource identifier" });
    return;
  }

  if (error instanceof multer.MulterError) {
    logger.warn(error.message, req.id);
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });
    return;
  }

  logger.error(error, req.id);
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error" });
};
