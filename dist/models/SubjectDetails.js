"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectDetails = void 0;
const mongoose_1 = require("mongoose");
const subjectDetailsSchema = new mongoose_1.Schema({
    department: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    totalClasses: { type: Number, required: true, default: 0 }
}, {
    timestamps: true
});
// Compound unique index so department, semester, and subject forms a unique configuration
subjectDetailsSchema.index({ department: 1, semester: 1, subject: 1 }, { unique: true });
exports.SubjectDetails = (0, mongoose_1.model)("SubjectDetails", subjectDetailsSchema);
