import express from "express";

import {
  getMe,
  getUserById,
  getUsers,
} from "@/controllers/user.controller.ts";
import { auth } from "@/middleware/auth.ts";
import { asyncHandler } from "@/middleware/async-handler.ts";

const router = express.Router();

router.get("/me", auth, asyncHandler(getMe));
router.get("/", asyncHandler(getUsers));
router.get("/:id", asyncHandler(getUserById));

export default router;
