import type { Request, Response } from "express";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import * as comicService from "@/services/comic.service.ts";

export const syncLatest = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const result = await comicService.syncLatestComics(page);
  res.status(HTTP_STATUS.OK).json({
    message: "Synchronization completed successfully",
    ...result,
  });
};

export const syncAll = async (req: Request, res: Response): Promise<void> => {
  const startPage = Number(req.query.page) || 1;
  // Chạy background sync
  comicService.syncAllComics(startPage).catch(console.error);
  
  res.status(HTTP_STATUS.ACCEPTED).json({
    message: "Full synchronization started in background",
    startPage,
  });
};

export const getComics = async (req: Request, res: Response): Promise<void> => {
  const comics = await comicService.getLocalComics(req.query);
  res.status(HTTP_STATUS.OK).json(comics);
};

export const getComicBySlug = async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
  const comic = await comicService.getLocalComicBySlug(req.params.slug);
  res.status(HTTP_STATUS.OK).json(comic);
};
