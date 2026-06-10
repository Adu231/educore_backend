import { Schema, model } from "mongoose";

export interface INewsletter {
  email: string;
}

const newsletterSchema = new Schema<INewsletter>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, {
  timestamps: true
});

export const Newsletter = model<INewsletter>("Newsletter", newsletterSchema);
