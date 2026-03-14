import mongoose, { type InferSchemaType, type Model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type User = InferSchemaType<typeof userSchema>;

const UserModel =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
