import express from "express";
import * as comicController from "@/controllers/comic.controller.ts";
import { asyncHandler } from "@/middleware/async-handler.ts";

const router = express.Router();

router.get("/comics", asyncHandler(comicController.listComics));
router.post("/comics/sync", asyncHandler(comicController.syncLatest));
router.post("/comics/sync-all", asyncHandler(comicController.syncAll));
router.post("/comics/sync-new", asyncHandler(comicController.syncNew));
router.get("/comics/:slug", asyncHandler(comicController.getComic));

export default router;
