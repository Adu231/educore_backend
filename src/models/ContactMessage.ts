import { Schema, model } from "mongoose";

export interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string; // e.g. "sales" or "support"
}

const contactMessageSchema = new Schema<IContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "support" }
}, {
  timestamps: true
});

export const ContactMessage = model<IContactMessage>("ContactMessage", contactMessageSchema);
