import { model, Schema, type Document as MongooseDocument } from "mongoose";

export interface IChapter extends MongooseDocument {
  comicId: Schema.Types.ObjectId;
  title: string;
  slug: string;
  chapterNumber: number;
  serverName: string;
  images: Array<{
    fileName: string;
    url: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    comicId: { type: Schema.Types.ObjectId, ref: "Comic", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    chapterNumber: { type: Number, required: true },
    serverName: { type: String, default: "otruyen" },
    images: [
      {
        fileName: { type: String },
        url: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Tránh trùng chapter cho cùng 1 bộ truyện
ChapterSchema.index({ comicId: 1, slug: 1 }, { unique: true });

export default model<IChapter>("Chapter", ChapterSchema);
