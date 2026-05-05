import mongoose, { Schema, type Document } from "mongoose";

export interface IComment extends Document {
  promiseId: string;
  author: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    promiseId: { type: String, required: true, index: true },
    author: { type: String, required: true, default: "Anonymous" },
    text: { type: String, required: true },
    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
