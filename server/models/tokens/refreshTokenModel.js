import mongoose from "mongoose";
import { refreshTokenSchema } from "./refreshTokenSchema.js";

export const RefreshToken =
  mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshTokenSchema);
