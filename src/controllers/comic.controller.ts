import type { Request, Response } from "express";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import * as ComicService from "@/services/comic.service.ts";
import { logger } from "@/utils/logger.ts";

export const syncLatest = async (req: Request, res: Response) => {
  const result = await ComicService.syncLatestComics();
  res.status(HTTP_STATUS.OK).json(result);
};

export const syncAll = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  logger.info(`[CONTROLLER] Triggering syncAllComics for page ${page}`);
  // Background job
  ComicService.syncAllComics(page).catch((err) => {
    logger.error(`[SYNC-ALL ERROR] ${err.message}`);
  });
  res.status(HTTP_STATUS.ACCEPTED).json({ message: "Full synchronization started in background", startPage: page });
};

export const syncNew = async (req: Request, res: Response) => {
  // Background job
  ComicService.syncNewOnly();
  res.status(HTTP_STATUS.ACCEPTED).json({ message: "Smart sync (New Only) started in background" });
};

export const resumeSync = async (req: Request, res: Response) => {
  logger.info("[CONTROLLER] Resuming sync from state file");
  // Background job
  ComicService.resumeSyncAllComics().catch((err) => {
    logger.error(`[RESUME SYNC ERROR] ${err.message}`);
  });
  res.status(HTTP_STATUS.ACCEPTED).json({ message: "Resuming synchronization from last saved state" });
};

export const listComics = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const sort = typeof req.query.sort === "string" ? req.query.sort : "-updatedAt";

  const result = await ComicService.getComics(page, limit, sort);
  res.status(HTTP_STATUS.OK).json(result);
};

export const getComic = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const comic = await ComicService.getComicBySlug(slug);

  if (!comic) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Comic not found" });
  }

  res.status(HTTP_STATUS.OK).json(comic);
};
