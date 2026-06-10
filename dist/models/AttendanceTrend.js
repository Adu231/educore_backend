"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceTrend = void 0;
const mongoose_1 = require("mongoose");
const attendanceTrendSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true, ref: "User" },
    month: { type: String, required: true },
    attendance: { type: Number, required: true }
}, {
    timestamps: true
});
exports.AttendanceTrend = (0, mongoose_1.model)("AttendanceTrend", attendanceTrendSchema);
