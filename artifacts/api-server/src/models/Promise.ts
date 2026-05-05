import mongoose, { Schema, type Document } from "mongoose";

export interface IPromise extends Document {
  slug: string;
  icon: string;
  titleBengali: string;
  titleEnglish: string;
  descriptionBengali: string;
  descriptionEnglish: string;
  amount: string;
  category: string;
  status: "pending" | "partial" | "fulfilled" | "broken";
  color: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PromiseSchema = new Schema<IPromise>(
  {
    slug: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    titleBengali: { type: String, required: true },
    titleEnglish: { type: String, required: true },
    descriptionBengali: { type: String, required: true },
    descriptionEnglish: { type: String, required: true },
    amount: { type: String, required: true },
    category: { type: String, required: true, default: "financial" },
    status: {
      type: String,
      enum: ["pending", "partial", "fulfilled", "broken"],
      default: "pending",
    },
    color: { type: String, default: "from-orange-500 to-amber-500" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Promise = mongoose.model<IPromise>("Promise", PromiseSchema);
