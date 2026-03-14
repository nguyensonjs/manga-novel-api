import fs from "node:fs";
import path from "node:path";

export const UPLOAD_ROOT_DIR = path.join(process.cwd(), "uploads");
export const DOCUMENT_UPLOAD_DIR = path.join(UPLOAD_ROOT_DIR, "documents");
export const DOCUMENT_CHUNK_DIR = path.join(UPLOAD_ROOT_DIR, "chunks");

export const ensureUploadDirectories = (): void => {
  fs.mkdirSync(DOCUMENT_UPLOAD_DIR, { recursive: true });
  fs.mkdirSync(DOCUMENT_CHUNK_DIR, { recursive: true });
};
