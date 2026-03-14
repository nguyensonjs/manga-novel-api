import type { Request, Response } from "express";

import { HTTP_STATUS } from "@/constants/http-status.ts";
import User from "@/models/user.model.ts";
import { HttpError } from "@/utils/http-error.ts";

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.find().select("-password");

  res.status(HTTP_STATUS.OK).json(users);
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  res.status(HTTP_STATUS.OK).json(user);
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
  }

  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  res.status(HTTP_STATUS.OK).json(user);
};
