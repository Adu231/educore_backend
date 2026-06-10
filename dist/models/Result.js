"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const mongoose_1 = require("mongoose");
const subjectGradeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    internal: { type: Number, required: true },
    external: { type: Number, required: true },
    total: { type: Number, required: true },
    grade: { type: String, required: true }
}, { _id: false });
const resultSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true, ref: "User" },
    semester: { type: String, required: true },
    year: { type: String, required: true },
    subjects: [subjectGradeSchema],
    sgpa: { type: Number, required: true },
    cgpa: { type: Number, required: true }
}, {
    timestamps: true
});
exports.Result = (0, mongoose_1.model)("Result", resultSchema);
