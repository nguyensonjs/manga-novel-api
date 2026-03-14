import mongoose from "mongoose";

import { env } from "@/config/env.ts";
import { logger } from "@/utils/logger.ts";

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);

  logger.database("MongoDB handshake complete");
};
