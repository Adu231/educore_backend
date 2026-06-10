import { Schema, model } from "mongoose";

export interface ITimetableSlot {
  time: string;
  subject: string;
  room: string;
  faculty: string;
}

export interface ITimetable {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  slots: ITimetableSlot[];
  roleScope: "student" | "admin" | "all"; // Scope scope (all by default)
  semester: string;
}

const slotSchema = new Schema<ITimetableSlot>({
  time: { type: String, required: true },
  subject: { type: String, required: true },
  room: { type: String, required: true },
  faculty: { type: String, required: true }
}, { _id: false });

const timetableSchema = new Schema<ITimetable>({
  day: { type: String, required: true, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  slots: [slotSchema],
  roleScope: { type: String, required: true, enum: ["student", "admin", "all"], default: "all" },
  semester: { type: String, required: true, default: "6th" }
}, {
  timestamps: true
});

timetableSchema.index({ day: 1, semester: 1 }, { unique: true });

export const Timetable = model<ITimetable>("Timetable", timetableSchema);
