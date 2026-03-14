import express from "express";

import { login, register } from "@/controllers/auth.controller.ts";
import { asyncHandler } from "@/middleware/async-handler.ts";

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;
