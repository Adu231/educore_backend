import { Schema, model } from "mongoose";

export interface IBlogPost {
  id: string; // b1, b2, etc.
  title: string;
  excerpt: string;
  content: string[]; // detailed multi-paragraph text
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  featured: boolean;
}

const blogPostSchema = new Schema<IBlogPost>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: [{ type: String, required: true }],
  author: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  readTime: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const BlogPost = model<IBlogPost>("BlogPost", blogPostSchema);
