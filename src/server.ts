import cors from "cors";
import express, { type Request, type Response } from "express";

import { connectDB } from "@/config/database.ts";
import { env } from "@/config/env.ts";
import { ensureUploadDirectories } from "@/config/storage.ts";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import { registerDocs } from "@/docs/register-docs.ts";
import { errorHandler } from "@/middleware/error-handler.ts";
import { requestLogger } from "@/middleware/request-logger.ts";
import documentRoutes from "@/routes/document.routes.ts";
import userRoutes from "@/routes/user.routes.ts";
import authRoutes from "@/routes/auth.routes.ts";
import otruyenRoutes from "@/routes/otruyen.routes.ts";
import { logger } from "@/utils/logger.ts";

const app = express();
const rootHandler = (_req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json({
    message: "Bun Api is working",
  });
};

await connectDB();
ensureUploadDirectories();

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
  }),
);

app.use(requestLogger);
app.use(express.json());

registerDocs(app);

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", otruyenRoutes);
app.use("/api", documentRoutes);
app.use("/uploads", express.static("uploads"));
app.get("/", rootHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.ready(`API ignition complete on http://localhost:${env.PORT}`);
});
