import mongoose from "mongoose";

const { Schema } = mongoose;

export const refreshTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expires_at: { type: Date, required: true },
    revoked_at: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
