type DocumentLike = {
  _id: { toString(): string };
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedBy?: { toString(): string } | string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const toDocumentResponse = (document: DocumentLike) => {
  const id = document._id.toString();

  return {
    _id: id,
    originalName: document.originalName,
    fileName: document.fileName,
    mimeType: document.mimeType,
    size: document.size,
    fileUrl: `/uploads/documents/${document.fileName}`,
    viewUrl: `/api/documents/${id}/view`,
    uploadedBy: document.uploadedBy?.toString(),
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
};
