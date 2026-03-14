import type { Request, Response } from "express";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import * as otruyenService from "@/services/otruyen.service.ts";
import { HttpError } from "@/utils/http-error.ts";

/**
 * Proxy function to forward requests to OTruyen API
 */
export const proxyOTruyen = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await otruyenService.fetchFromOTruyen(
      req.path,
      req.query,
      req.method,
      req.body
    );
    res.status(HTTP_STATUS.OK).json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      `Failed to fetch from OTruyen: ${(error as Error).message}`
    );
  }
};
