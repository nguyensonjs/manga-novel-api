import { model, Schema, type Document as MongooseDocument } from "mongoose";

export interface IComic extends MongooseDocument {
  title: string;
  slug: string;
  originName: string[];
  content: string;
  thumbUrl: string;
  posterUrl: string;
  status: string;
  author: string[];
  category: string[];
  lastUpdateOTruyen: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ComicSchema = new Schema<IComic>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    originName: { type: [String], default: [] },
    content: { type: String, default: "" },
    thumbUrl: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    status: { type: String, default: "ongoing" },
    author: { type: [String], default: [] },
    category: { type: [String], default: [] },
    lastUpdateOTruyen: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model<IComic>("Comic", ComicSchema);
