import express from "express";
import * as comicController from "@/controllers/comic.controller.ts";
import { asyncHandler } from "@/middleware/async-handler.ts";

const router = express.Router();

router.get("/", asyncHandler(comicController.listComics));
router.post("/sync", asyncHandler(comicController.syncLatest));
router.post("/sync-all", asyncHandler(comicController.syncAll));
router.post("/sync-new", asyncHandler(comicController.syncNew));
router.post("/sync-resume", asyncHandler(comicController.resumeSync));
router.get("/:slug", asyncHandler(comicController.getComic));

export default router;
