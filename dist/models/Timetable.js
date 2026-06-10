"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timetable = void 0;
const mongoose_1 = require("mongoose");
const slotSchema = new mongoose_1.Schema({
    time: { type: String, required: true },
    subject: { type: String, required: true },
    room: { type: String, required: true },
    faculty: { type: String, required: true }
}, { _id: false });
const timetableSchema = new mongoose_1.Schema({
    day: { type: String, required: true, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    slots: [slotSchema],
    roleScope: { type: String, required: true, enum: ["student", "admin", "all"], default: "all" },
    semester: { type: String, required: true, default: "6th" }
}, {
    timestamps: true
});
timetableSchema.index({ day: 1, semester: 1 }, { unique: true });
exports.Timetable = (0, mongoose_1.model)("Timetable", timetableSchema);
