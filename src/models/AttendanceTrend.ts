import { Schema, model } from "mongoose";

export interface IAttendanceTrend {
  studentId: string;
  month: string;
  attendance: number;
}

const attendanceTrendSchema = new Schema<IAttendanceTrend>({
  studentId: { type: String, required: true, ref: "User" },
  month: { type: String, required: true },
  attendance: { type: Number, required: true }
}, {
  timestamps: true
});

export const AttendanceTrend = model<IAttendanceTrend>("AttendanceTrend", attendanceTrendSchema);
