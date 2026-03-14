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
  const result = await fetchFromOTruyen<OTruyenResponse<{ items: OTruyenItem[]; params: { pagination: any } }>>(
    "/danh-sach/truyen-moi",
    { page },
    "GET"
  );

  if (!result.data || !result.data.items) {
    console.error("[SYNC] Invalid data received:", JSON.stringify(result));
    throw new Error("Invalid data received from OTruyen");
  }

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
    pagination: result.data.params.pagination,
    items: syncResults,
  };
};

export const syncAllComics = async (startPage: number = 1) => {
  let currentPage = startPage;
  let totalSynced = 0;
  let hasNext = true;

  console.log(`[SYNC] Starting full sync from page ${startPage}...`);

  while (hasNext) {
    try {
      const result = await syncLatestComics(currentPage);
      totalSynced += result.totalSynced;
      
      const { totalItems, totalItemsPerPage, currentPage: page } = result.pagination;
      const totalPages = Math.ceil(totalItems / totalItemsPerPage);

      console.log(`[SYNC] Page ${currentPage}/${totalPages} completed. Synced ${totalSynced} items so far.`);

      if (currentPage >= totalPages) {
        hasNext = false;
      } else {
        currentPage++;
        // Thêm delay nhỏ để tránh bị rate limit hoặc quá tải
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`[SYNC] Error at page ${currentPage}:`, (error as Error).message);
      // Tiếp tục trang tiếp theo nếu lỗi 1 trang
      currentPage++;
      if (currentPage > 2000) hasNext = false; // Guard
    }
  }

  console.log(`[SYNC] Full sync finished. Total synced: ${totalSynced}`);
  return { totalSynced };
};

export const getLocalComics = async (query: any = {}) => {
  return await Comic.find({ isDeleted: false, ...query }).sort({ updatedAt: -1 });
};

export const getLocalComicBySlug = async (slug: string) => {
  return await Comic.findOne({ slug, isDeleted: false });
};
