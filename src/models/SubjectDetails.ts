import { Schema, model } from "mongoose";

export interface ISubjectDetails {
  department: string;
  semester: string;
  subject: string;
  totalClasses: number;
}

const subjectDetailsSchema = new Schema<ISubjectDetails>({
  department: { type: String, required: true },
  semester: { type: String, required: true },
  subject: { type: String, required: true },
  totalClasses: { type: Number, required: true, default: 0 }
}, {
  timestamps: true
});

// Compound unique index so department, semester, and subject forms a unique configuration
subjectDetailsSchema.index({ department: 1, semester: 1, subject: 1 }, { unique: true });

export const SubjectDetails = model<ISubjectDetails>("SubjectDetails", subjectDetailsSchema);
