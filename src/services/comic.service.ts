import { logger } from "@/utils/logger.ts";
import Comic from "@/models/comic.model.ts";
import Chapter from "@/models/chapter.model.ts";
import { fetchFromOTruyen } from "./otruyen.service.ts";
import type { OTruyenItem, OTruyenResponse } from "@/types/otruyen.ts";
import { saveSyncState, loadSyncState } from "@/utils/sync-state.ts";

let syncInProgress = false;

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
    { upsert: true, returnDocument: "after" }
  );
};

export const syncChapters = async (comicId: string, servers: any[], comicTitle?: string) => {
  for (const server of servers) {
    const totalChaps = server.server_data.length;
    let chapCount = 0;
    for (const chap of server.server_data) {
      chapCount++;
      // Fetch chapter images if available
      let images: any[] = [];
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(chap.chapter_api_data, { signal: controller.signal });
        clearTimeout(timeout);
        
        const chapDetail = (await response.json()) as any;
        if (chapDetail && chapDetail.data && chapDetail.data.item) {
          const serverImage = chapDetail.data.item.chapter_path;
          images = chapDetail.data.item.chapter_image.map((img: any) => ({
            fileName: img.image_file,
            url: `${chapDetail.data.domain_cdn}/${serverImage}/${img.image_file}`,
          }));
        }
      } catch (err) {
        logger.error(`[SYNC] Failed to fetch images for chapter ${chap.chapter_name}: ${(err as Error).message}`);
      }

      const progress = `[SYNC] [${comicTitle || "Comic"}] Chapter ${chapCount}/${totalChaps} (${chap.chapter_name}) Saving...`;
      logger.info(progress);

      await Chapter.findOneAndUpdate(
        { comicId: comicId as any, slug: chap.chapter_name } as any,
        {
          title: chap.chapter_title,
          chapterNumber: parseFloat(chap.chapter_name) || 0,
          serverName: server.server_name,
          images: images
        },
        { upsert: true }
      );
      // Small delay between chapters to be safe
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
};

export const syncComicDetails = async (slug: string) => {
  const result = await fetchFromOTruyen<OTruyenResponse<{ item: OTruyenItem }>>(
    `/truyen-tranh/${slug}`,
    {},
    "GET"
  );
  
  if (!result.data || !result.data.item) {
    throw new Error(`Could not fetch details for comic: ${slug}`);
  }

  const item = result.data.item;
  const comic = await upsertComic(item);

  if (item.chapters) {
    await syncChapters(comic._id.toString(), item.chapters, item.name);
  }

  const doneMsg = `[SYNC] [DONE] Completed syncing: ${item.name}`;
  logger.info(doneMsg);
  return comic;
};

export const syncLatestComics = async (page: number = 1, deepSync: boolean = false) => {
  const result = await fetchFromOTruyen<OTruyenResponse<{ items: OTruyenItem[]; params: { pagination: any } }>>(
    "/danh-sach/truyen-moi",
    { page },
    "GET"
  );

  if (!result.data || !result.data.items) {
    logger.error(`[SYNC] Invalid data received: ${JSON.stringify(result)}`);
    throw new Error("Invalid data received from OTruyen");
  }

  const syncResults = [];
  let itemIdx = 0;
  for (const item of result.data.items) {
    itemIdx++;
    let comic;
    if (deepSync) {
      const pageInfo = `[SYNC] [PAGE ${page}] Comic ${itemIdx}/20: ${item.name} (${item.slug})`;
      logger.info(pageInfo);
      comic = await syncComicDetails(item.slug);
      // Explicitly log after each comic success
      logger.ready(`[SYNC] successfully updated: ${item.slug}`);
      // Delay 1.5s after each comic detail fetch
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      comic = await upsertComic(item);
    }

    syncResults.push({
      id: comic._id,
      title: comic.title,
      slug: comic.slug,
    });
  }

  logger.info(`[SYNC] [PAGE ${page}] Finished processing all comics on page.`);
  return {
    totalSynced: syncResults.length,
    pagination: result.data.params.pagination,
    items: syncResults,
  };
};

export const syncAllComics = async (startPage: number = 1) => {
  if (syncInProgress) {
    logger.warn("[SYNC] Synchronization is already in progress. Ignoring new request.");
    return;
  }
  
  syncInProgress = true;
  let currentPage = startPage;
  let totalSynced = 0;
  let hasNext = true;

  const startMsg = `[SYNC] [START] Full deep sync from page ${startPage}...`;
  logger.ready(startMsg);
  await saveSyncState({ lastPage: currentPage, status: "ongoing" });

  while (hasNext) {
    try {
      logger.info(`[SYNC] [PROCESS] Fetching page ${currentPage}...`);
      const result = await syncLatestComics(currentPage, true);
      totalSynced += result.totalSynced;

      const { totalItems, totalItemsPerPage } = result.pagination;
      const totalPages = Math.ceil(totalItems / totalItemsPerPage);

      logger.info(`[SYNC] [SUCCESS] Page ${currentPage}/${totalPages} completed. Total: ${totalSynced}`);
      
      // Save progress to file
      await saveSyncState({ 
        lastPage: currentPage, 
        totalSynced,
        status: currentPage >= totalPages ? "completed" : "ongoing"
      });

      if (currentPage >= totalPages) {
        hasNext = false;
        syncInProgress = false;
      } else {
        currentPage++;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      logger.error(`[SYNC] [FATAL] Error at page ${currentPage}: ${(error as Error).message}`);
      await saveSyncState({ status: "failed" });
      syncInProgress = false;
      currentPage++;
      if (currentPage > 3000) hasNext = false;
      break; 
    }
  }

  logger.ready(`[SYNC] [FINISH] Full sync ended. Total synced: ${totalSynced}`);
  syncInProgress = false;
  return { totalSynced };
};

export const resumeSyncAllComics = async () => {
  const state = await loadSyncState();
  if (state.status === "completed") {
    logger.info("[SYNC] Previous sync was completed. Starting smart update instead.");
    return syncNewOnly();
  }
  
  const startPage = state.lastPage || 1;
  logger.info(`[SYNC] Resuming sync from page ${startPage}...`);
  return syncAllComics(startPage);
};

export const syncNewOnly = async () => {
  let currentPage = 1;
  let totalSynced = 0;
  let shouldContinue = true;

  logger.info("[SYNC] Starting smart update (New Only)...");

  while (shouldContinue) {
    const result = await fetchFromOTruyen<OTruyenResponse<{ items: OTruyenItem[]; params: { pagination: any } }>>(
      "/danh-sach/truyen-moi",
      { page: currentPage },
      "GET"
    );

    if (!result.data || !result.data.items || result.data.items.length === 0) break;

    for (const item of result.data.items) {
      const existing = await Comic.findOne({ slug: item.slug }).lean();

      if (existing && existing.lastUpdateOTruyen?.getTime() === new Date(item.updatedAt).getTime()) {
        logger.info(`[SYNC] Reached existing comic: ${item.slug}. Stopping smart update.`);
        shouldContinue = false;
        break;
      }

      logger.info(`[SYNC] Updating/Creating: ${item.slug}`);
      await syncComicDetails(item.slug);
      totalSynced++;

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    if (shouldContinue) {
      currentPage++;
      logger.info(`[SYNC] Smart update moving to page ${currentPage}...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  logger.info(`[SYNC] Smart update finished. Total updated: ${totalSynced}`);
  return { totalSynced };
};

export const getComics = async (page: number = 1, limit: number = 20, sort: string = "-updatedAt") => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Comic.find({ isDeleted: false }).sort(sort).skip(skip).limit(limit).lean(),
    Comic.countDocuments({ isDeleted: false }),
  ]);

  return {
    items,
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    },
  };
};

export const getComicBySlug = async (slug: string) => {
  const comic = await Comic.findOne({ slug, isDeleted: false }).lean();
  if (!comic) return null;

  const chapters = await Chapter.find({ comicId: comic._id } as any)
    .sort({ chapterNumber: -1 })
    .lean();

  return { ...comic, chapters };
};

export const startSyncWatchdog = () => {
  logger.info("[WATCHDOG] Initializing automated sync monitor (1 hour interval)");
  
  // Set a small delay for the first check to not interfere with startup
  setTimeout(async () => {
    const state = await loadSyncState();
    if (state.status !== "completed" && !syncInProgress) {
      logger.warn(`[WATCHDOG] Initial check: Sync is not completed. Resuming from page ${state.lastPage}...`);
      resumeSyncAllComics();
    }
  }, 5000);

  setInterval(async () => {
    const state = await loadSyncState();
    if (state.status !== "completed" && !syncInProgress) {
      logger.warn(`[WATCHDOG] Sync is not completed and not running. Resuming from page ${state.lastPage}...`);
      resumeSyncAllComics();
    }
  }, 1000 * 60 * 60); 
};
