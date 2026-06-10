import { Schema, model } from "mongoose";

export interface ISubmission {
  fileUrl: string;
  notes?: string;
  submittedAt: Date;
}

export interface IAssignment {
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  marks: number | null;
  maxMarks: number;
  description: string;
  studentId: string;
  submission?: ISubmission;
}

const submissionSchema = new Schema<ISubmission>({
  fileUrl: { type: String, required: true },
  notes: { type: String },
  submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const assignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, required: true, enum: ["pending", "submitted", "graded"], default: "pending" },
  marks: { type: Number, default: null },
  maxMarks: { type: Number, required: true },
  description: { type: String, required: true },
  studentId: { type: String, required: true, ref: "User" },
  submission: { type: submissionSchema }
}, {
  timestamps: true
});

export const Assignment = model<IAssignment>("Assignment", assignmentSchema);
