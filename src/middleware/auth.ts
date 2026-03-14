import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/config/env.ts";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import type { JwtPayload } from "@/types/user.ts";
import { HttpError } from "@/utils/http-error.ts";

export const auth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    next(
      new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        "Authorization header is required",
      ),
    );
    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(
      new HttpError(
        HTTP_STATUS.UNAUTHORIZED,
        "Authorization header must use Bearer token",
      ),
    );
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!payload.userId) {
      next(new HttpError(HTTP_STATUS.UNAUTHORIZED, "Invalid token payload"));
      return;
    }

    req.user = {
      userId: payload.userId,
    };

    next();
  } catch {
    next(new HttpError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired token"));
  }
};
