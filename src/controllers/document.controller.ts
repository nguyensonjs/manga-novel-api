import type { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants/http-status.ts";
import { toDocumentResponse } from "@/presenters/document.presenter.ts";
import {
  createDocumentsFromFiles,
  findDocumentById,
  getDocumentAbsolutePath,
  handleChunkUpload,
  listDocuments,
} from "@/services/document.service.ts";
import { HttpError } from "@/utils/http-error.ts";

export const uploadDocumentFiles = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Please upload at least one file");
  }

  const documents = await createDocumentsFromFiles(files, req.user?.userId);

  res.status(HTTP_STATUS.CREATED).json(documents.map(toDocumentResponse));
};

export const getDocuments = async (_req: Request, res: Response): Promise<void> => {
  const documents = await listDocuments();

  res.status(HTTP_STATUS.OK).json(documents.map(toDocumentResponse));
};

export const getDocumentById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const document = await findDocumentById(req.params.id);

  res.status(HTTP_STATUS.OK).json(toDocumentResponse(document));
};

export const viewDocumentById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const document = await findDocumentById(req.params.id);
  const absolutePath = getDocumentAbsolutePath(document.fileName);

  res.type(document.mimeType);
  res.sendFile(absolutePath);
};

export const uploadDocumentChunkFile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const file = req.file;
  const uploadId = String(req.body.uploadId || "").trim();
  const originalName = String(req.body.originalName || "").trim();
  const chunkIndex = Number(req.body.chunkIndex);
  const totalChunks = Number(req.body.totalChunks);
  const mimeType =
    String(req.body.mimeType || "").trim() || file?.mimetype || "application/octet-stream";

  if (!file) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Chunk file is required");
  }

  if (!uploadId || !originalName) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      "uploadId and originalName are required",
    );
  }

  if (
    Number.isNaN(chunkIndex) ||
    Number.isNaN(totalChunks) ||
    chunkIndex < 0 ||
    totalChunks <= 0 ||
    chunkIndex >= totalChunks
  ) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      "chunkIndex and totalChunks are invalid",
    );
  }

  const result = await handleChunkUpload({
    chunkIndex,
    file,
    mimeType,
    originalName,
    totalChunks,
    uploadId,
    uploadedBy: req.user?.userId,
  });

  // `200` nghĩa là server đã nhận chunk này, nhưng vẫn đang chờ các chunk còn lại.
  if (!result.completed) {
    res.status(HTTP_STATUS.OK).json(result);
    return;
  }

  // `201` nghĩa là đã nhận chunk cuối, ghép file xong và lưu metadata thành công.
  res.status(HTTP_STATUS.CREATED).json({
    ...result,
    document: toDocumentResponse(result.document),
  });
};
