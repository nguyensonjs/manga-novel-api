import express from "express";

import {
  getMe,
  getUserById,
  getUsers,
  login,
  register,
} from "@/controllers/user.controller.ts";
import { auth } from "@/middleware/auth.ts";
import { asyncHandler } from "@/middleware/async-handler.ts";

const router = express.Router();

router.get("/me", auth, asyncHandler(getMe));
router.get("/users", asyncHandler(getUsers));
router.get("/users/:id", asyncHandler(getUserById));
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;
