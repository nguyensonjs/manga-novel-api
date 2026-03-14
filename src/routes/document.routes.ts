import {
  getDocumentById,
  getDocuments,
  uploadDocumentChunkFile,
  uploadDocumentFiles,
  viewDocumentById,
} from "@/controllers/document.controller.ts";
import { asyncHandler } from "@/middleware/async-handler.ts";
import { auth } from "@/middleware/auth.ts";
import { uploadDocumentChunk, uploadDocuments } from "@/middleware/upload-document.ts";
import express from "express";

const router = express.Router();
const getDocumentsHandler = asyncHandler(getDocuments);
const getDocumentByIdHandler = asyncHandler(getDocumentById);
const viewDocumentByIdHandler = asyncHandler(viewDocumentById);
const uploadDocumentChunkHandler = asyncHandler(uploadDocumentChunkFile);
const uploadDocumentFilesHandler = asyncHandler(uploadDocumentFiles);

// Các route public để lấy danh sách, xem metadata, và mở file đã upload.
router.get("/", getDocumentsHandler);
router.get("/:id", getDocumentByIdHandler);
router.get("/:id/view", viewDocumentByIdHandler);

// Các route upload đều cần đăng nhập trước khi nhận file.
// Upload thường đơn giản hơn khi client gửi được cả file trong một request.
router.post("/upload", auth, uploadDocuments, uploadDocumentFilesHandler);

// Upload theo chunk phù hợp cho file lớn hoặc mạng không ổn định.
router.post(
  "/upload/chunk",
  auth,
  uploadDocumentChunk,
  uploadDocumentChunkHandler,
);

export default router;
