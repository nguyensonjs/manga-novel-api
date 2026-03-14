import { HTTP_STATUS } from "@/constants/http-status.ts";
import User from "@/models/user.model.ts";
import { HttpError } from "@/utils/http-error.ts";

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const findUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new HttpError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  return user;
};
