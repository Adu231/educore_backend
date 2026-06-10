import { Schema, model } from "mongoose";

export interface ISubjectGrade {
  name: string;
  internal: number;
  external: number;
  total: number;
  grade: string;
}

export interface IResult {
  studentId: string;
  semester: string;
  year: string;
  subjects: ISubjectGrade[];
  sgpa: number;
  cgpa: number;
}

const subjectGradeSchema = new Schema<ISubjectGrade>({
  name: { type: String, required: true },
  internal: { type: Number, required: true },
  external: { type: Number, required: true },
  total: { type: Number, required: true },
  grade: { type: String, required: true }
}, { _id: false });

const resultSchema = new Schema<IResult>({
  studentId: { type: String, required: true, ref: "User" },
  semester: { type: String, required: true },
  year: { type: String, required: true },
  subjects: [subjectGradeSchema],
  sgpa: { type: Number, required: true },
  cgpa: { type: Number, required: true }
}, {
  timestamps: true
});

export const Result = model<IResult>("Result", resultSchema);
