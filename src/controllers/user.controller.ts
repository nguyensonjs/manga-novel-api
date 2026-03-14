import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "@/config/env.ts";
import { HTTP_STATUS } from "@/constants/http-status.ts";
import User from "@/models/user.model.ts";
import type { LoginBody, RegisterBody } from "@/types/user.ts";
import { HttpError } from "@/utils/http-error.ts";

export const register = async (
  req: Request<Record<string, never>, unknown, RegisterBody>,
  res: Response,
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      "Name, email, and password are required",
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new HttpError(HTTP_STATUS.CONFLICT, "Email is already in use");
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hash,
  });

  res.status(HTTP_STATUS.CREATED).json(user);
};

export const login = async (
  req: Request<Record<string, never>, unknown, LoginBody>,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      "Email and password are required",
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(HTTP_STATUS.OK).json({ token });
};

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
