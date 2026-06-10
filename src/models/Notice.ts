import { Schema, model } from "mongoose";

export interface INotice {
  title: string;
  category: string;
  date: string;
  priority: "high" | "medium" | "low";
  content: string;
  published: boolean;
}

const noticeSchema = new Schema<INotice>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  priority: { type: String, required: true, enum: ["high", "medium", "low"], default: "medium" },
  content: { type: String, required: true },
  published: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Notice = model<INotice>("Notice", noticeSchema);
