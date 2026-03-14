import fs from "node:fs";
import path from "node:path";

import { DOCUMENT_CHUNK_DIR, DOCUMENT_UPLOAD_DIR, ensureUploadDirectories } from "@/config/storage.ts";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import Document from "@/models/document.model.ts";
import { HttpError } from "@/utils/http-error.ts";

type UserId = string | undefined;

type ChunkUploadInput = {
  chunkIndex: number;
  file: Express.Multer.File;
  mimeType: string;
  originalName: string;
  totalChunks: number;
  uploadId: string;
  uploadedBy?: UserId;
};

const getSafeFileName = (uploadId: string, originalName: string): string => {
  const parsedName = path.parse(originalName);
  const safeBaseName =
    parsedName.name.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 50) || "document";

  return `${uploadId}-${safeBaseName}${parsedName.ext}`;
};

export const createDocumentsFromFiles = async (
  files: Express.Multer.File[],
  uploadedBy?: UserId,
) => {
  if (!files.length) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Please upload at least one file");
  }

  return Document.insertMany(
    files.map((file) => ({
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype || "application/octet-stream",
      size: file.size,
      relativePath: path.posix.join("uploads", "documents", file.filename),
      uploadedBy,
    })),
  );
};

export const listDocuments = async () => {
  return Document.find().sort({ createdAt: -1 });
};

export const findDocumentById = async (id: string) => {
  const document = await Document.findById(id);

  if (!document) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, "Document not found");
  }

  return document;
};

export const getDocumentAbsolutePath = (fileName: string): string => {
  const absolutePath = path.join(DOCUMENT_UPLOAD_DIR, fileName);

  if (!fs.existsSync(absolutePath)) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, "Document file not found");
  }

  return absolutePath;
};

export const handleChunkUpload = async ({
  chunkIndex,
  file,
  mimeType,
  originalName,
  totalChunks,
  uploadId,
  uploadedBy,
}: ChunkUploadInput) => {
  // Mỗi uploadId có một thư mục tạm riêng để các phiên upload không đè lên nhau.
  ensureUploadDirectories();

  const uploadChunkDir = path.join(DOCUMENT_CHUNK_DIR, uploadId);
  fs.mkdirSync(uploadChunkDir, { recursive: true });

  // Lưu chunk hiện tại theo chunkIndex để ghép lại đúng thứ tự sau này.
  const chunkPath = path.join(uploadChunkDir, `${chunkIndex}.part`);
  fs.writeFileSync(chunkPath, file.buffer);

  const uploadedChunks = Array.from({ length: totalChunks }, (_, index) => index).filter(
    (index) => fs.existsSync(path.join(uploadChunkDir, `${index}.part`)),
  );

  if (uploadedChunks.length !== totalChunks) {
    return {
      chunkIndex,
      completed: false,
      totalChunks,
      uploadId,
      uploadedChunks: uploadedChunks.length,
    } as const;
  }

  // Khi đã nhận đủ tất cả chunk, ghép chung lại thành file cuối cùng.
  const finalFileName = getSafeFileName(uploadId, originalName);
  const finalFilePath = path.join(DOCUMENT_UPLOAD_DIR, finalFileName);
  const writeStream = fs.createWriteStream(finalFilePath);

  for (let index = 0; index < totalChunks; index += 1) {
    const partPath = path.join(uploadChunkDir, `${index}.part`);
    writeStream.write(fs.readFileSync(partPath));
  }

  await new Promise<void>((resolve, reject) => {
    writeStream.end((error?: Error | null) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  const stats = fs.statSync(finalFilePath);
  const document = await Document.create({
    originalName,
    fileName: finalFileName,
    mimeType,
    size: stats.size,
    relativePath: path.posix.join("uploads", "documents", finalFileName),
    uploadedBy,
  });

  // Xóa chunk tạm sau khi tạo file và lưu metadata thành công.
  fs.rmSync(uploadChunkDir, { recursive: true, force: true });

  return {
    chunkIndex,
    completed: true,
    document,
    totalChunks,
    uploadId,
    uploadedChunks: totalChunks,
  } as const;
};
