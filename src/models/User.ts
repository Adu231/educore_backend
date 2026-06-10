import { Schema, model, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  id: string; // custom id matching CS2021001, etc.
  name: string;
  email: string;
  passwordHash: string;
  role: "student" | "admin";
  avatar?: string;
  rollNumber?: string;
  department?: string;
  semester?: string;
  phone?: string;
  address?: string;
  joinDate?: string;
  attendance?: number; // for admin-level listing
  cgpa?: number; // for admin-level listing
  status?: "active" | "warning" | "at-risk" | "on-leave"; // for user listing
  profileCompleted?: boolean;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ["student", "admin"] },
  avatar: { type: String },
  rollNumber: { type: String },
  department: { type: String },
  semester: { type: String },
  phone: { type: String },
  address: { type: String },
  joinDate: { type: String },
  attendance: { type: Number },
  cgpa: { type: Number },
  status: { type: String, enum: ["active", "warning", "at-risk", "on-leave"], default: "active" },
  profileCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Compare password
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = model<IUser, UserModel>("User", userSchema);
