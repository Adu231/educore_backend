import { Schema, model } from "mongoose";

export interface IAttendance {
  studentId: string;
  subject: string;
  total: number;
  attended: number;
  percentage: number;
}

const attendanceSchema = new Schema<IAttendance>({
  studentId: { type: String, required: true, ref: "User" },
  subject: { type: String, required: true },
  total: { type: Number, required: true },
  attended: { type: Number, required: true },
  percentage: { type: Number, required: true }
}, {
  timestamps: true
});

export const Attendance = model<IAttendance>("Attendance", attendanceSchema);
