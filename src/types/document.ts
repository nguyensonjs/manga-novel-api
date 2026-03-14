export type DocumentUploadResponse = {
  _id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  fileUrl: string;
  viewUrl: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
};
