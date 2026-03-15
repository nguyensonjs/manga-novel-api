import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "./logger.ts";

const STATE_FILE = path.join(process.cwd(), "sync-state.json");

interface SyncState {
  lastPage: number;
  totalSynced: number;
  status: "ongoing" | "completed" | "failed";
  updatedAt: string;
}

export const saveSyncState = async (state: Partial<SyncState>) => {
  try {
    const currentState = await loadSyncState();
    const newState = {
      ...currentState,
      ...state,
      updatedAt: new Date().toISOString(),
    };
    await fs.writeFile(STATE_FILE, JSON.stringify(newState, null, 2));
  } catch (err) {
    logger.error(`[SYNC STATE] Failed to save state: ${(err as Error).message}`);
  }
};

export const loadSyncState = async (): Promise<SyncState> => {
  try {
    const data = await fs.readFile(STATE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or is invalid, return default state
    return {
      lastPage: 0,
      totalSynced: 0,
      status: "ongoing",
      updatedAt: new Date().toISOString(),
    };
  }
};
