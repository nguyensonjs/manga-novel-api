import express from "express";
import { proxyOTruyen } from "@/controllers/otruyen.controller.ts";
import { asyncHandler } from "@/middleware/async-handler.ts";

const router = express.Router();

// Catch all routes and pass to proxy
// Matches: /api/otruyen/*
router.get(/\/otruyen.*/, asyncHandler(proxyOTruyen));

export default router;
