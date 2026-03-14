import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import userRoutes from "./user.routes.ts";
import otruyenRoutes from "./otruyen.routes.ts";
import documentRoutes from "./document.routes.ts";
import comicRoutes from "./comic.routes.ts";

const router = Router();

/**
 * Register all routes under /api
 */
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/otruyen", otruyenRoutes);
router.use("/documents", documentRoutes);
router.use("/comics", comicRoutes);

export default router;
