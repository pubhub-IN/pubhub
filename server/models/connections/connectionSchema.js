import mongoose from "mongoose";

const { Schema } = mongoose;

export const connectionSchema = new Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending", index: true },
    message: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });
