import type { Request, Response } from "express";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import * as userService from "@/services/user.service.ts";
import { HttpError } from "@/utils/http-error.ts";

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await userService.getAllUsers();
  res.status(HTTP_STATUS.OK).json(users);
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const user = await userService.findUserById(req.params.id);
  res.status(HTTP_STATUS.OK).json(user);
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
  }

  const user = await userService.findUserById(req.user.userId);
  res.status(HTTP_STATUS.OK).json(user);
};
