"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const mongoose_1 = require("mongoose");
const submissionSchema = new mongoose_1.Schema({
    fileUrl: { type: String, required: true },
    notes: { type: String },
    submittedAt: { type: Date, default: Date.now }
}, { _id: false });
const assignmentSchema = new mongoose_1.Schema({
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
exports.Assignment = (0, mongoose_1.model)("Assignment", assignmentSchema);
