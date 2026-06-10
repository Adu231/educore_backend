"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const mongoose_1 = require("mongoose");
const attendanceSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true, ref: "User" },
    subject: { type: String, required: true },
    total: { type: Number, required: true },
    attended: { type: Number, required: true },
    percentage: { type: Number, required: true }
}, {
    timestamps: true
});
exports.Attendance = (0, mongoose_1.model)("Attendance", attendanceSchema);
