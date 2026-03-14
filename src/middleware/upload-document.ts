import path from "node:path";

import multer from "multer";
import type { Request } from "express";

import {
  DOCUMENT_UPLOAD_DIR,
  ensureUploadDirectories,
} from "@/config/storage.ts";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import { HttpError } from "@/utils/http-error.ts";

ensureUploadDirectories();

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) => {
    callback(null, DOCUMENT_UPLOAD_DIR);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => {
    const parsedName = path.parse(file.originalname);
    const safeBaseName =
      parsedName.name.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 50) || "document";

    callback(null, `${Date.now()}-${safeBaseName}${parsedName.ext}`);
  },
});

// Upload thường ghi file hoàn chỉnh trực tiếp vào thư mục documents.
export const uploadDocuments = multer({
  storage,
  limits: {
    files: 10,
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    if (!file.originalname) {
      callback(new HttpError(HTTP_STATUS.BAD_REQUEST, "Invalid file upload"));
      return;
    }

    callback(null, true);
  },
}).array("files", 10);

// Upload theo chunk giữ từng phần trong bộ nhớ để service ghép file sau.
export const uploadDocumentChunk = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");
