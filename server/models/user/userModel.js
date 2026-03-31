import mongoose from "mongoose";
import { userSchema } from "./userSchema.js";

export const User = mongoose.models.User || mongoose.model("User", userSchema);
