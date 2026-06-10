import { Schema, model } from "mongoose";

export interface IFaculty {
  id: string; // custom id matching F007, etc.
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  department?: string;
  experience?: string;
  qualification?: string;
  status?: "active" | "inactive";
}

const facultySchema = new Schema<IFaculty>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  subject: { type: String },
  department: { type: String },
  experience: { type: String },
  qualification: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, {
  timestamps: true
});

export const Faculty = model<IFaculty>("Faculty", facultySchema);
