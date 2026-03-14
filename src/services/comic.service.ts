import Comic from "@/models/comic.model.ts";
import Chapter from "@/models/chapter.model.ts";
import { fetchFromOTruyen } from "./otruyen.service.ts";
import type { OTruyenItem, OTruyenResponse } from "@/types/otruyen.ts";

export const upsertComic = async (item: OTruyenItem) => {
  return await Comic.findOneAndUpdate(
    { slug: item.slug },
    {
      title: item.name,
      originName: item.origin_name,
      content: item.content,
      thumbUrl: item.thumb_url,
      posterUrl: item.poster_url,
      status: item.status,
      author: item.author,
      category: item.category.map((c) => c.name),
      lastUpdateOTruyen: new Date(item.updatedAt),
      isDeleted: false,
    },
    { upsert: true, new: true }
  );
};

export const syncLatestComics = async (page: number = 1) => {
  const result = await fetchFromOTruyen<OTruyenResponse<{ items: OTruyenItem[] }>>(
    "/danh-sach/truyen-moi",
    { page },
    "GET"
  );

  const syncResults = [];
  for (const item of result.data.items) {
    const comic = await upsertComic(item);
    syncResults.push({
      id: comic._id,
      title: comic.title,
      slug: comic.slug,
    });
  }

  return {
    totalSynced: syncResults.length,
    items: syncResults,
  };
};

export const getLocalComics = async (query: any = {}) => {
  return await Comic.find({ isDeleted: false, ...query }).sort({ updatedAt: -1 });
};

export const getLocalComicBySlug = async (slug: string) => {
  return await Comic.findOne({ slug, isDeleted: false });
};
