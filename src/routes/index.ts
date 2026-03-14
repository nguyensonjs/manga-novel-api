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
router.use(authRoutes);
router.use(userRoutes);
router.use(otruyenRoutes);
router.use(documentRoutes);
router.use(comicRoutes);

export default router;
