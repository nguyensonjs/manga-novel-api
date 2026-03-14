import type { AuthenticatedUser } from "./user.ts";

declare module "express-serve-static-core" {
  interface Request {
    files?: Express.Multer.File[];
    id?: string;
    user?: AuthenticatedUser;
  }
}

export {};
