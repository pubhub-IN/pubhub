import mongoose from "mongoose";
import { connectionSchema } from "./connectionSchema.js";

export const Connection =
  mongoose.models.Connection || mongoose.model("Connection", connectionSchema);
