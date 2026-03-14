import type { Request, Response } from "express";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import * as authService from "@/services/auth.service.ts";

export const register = async (
  req: Request<Record<string, never>, unknown, any>,
  res: Response,
): Promise<void> => {
  const user = await authService.registerUser(req.body);
  res.status(HTTP_STATUS.CREATED).json(user);
};

export const login = async (
  req: Request<Record<string, never>, unknown, any>,
  res: Response,
): Promise<void> => {
  const result = await authService.loginUser(req.body);
  res.status(HTTP_STATUS.OK).json(result);
};
