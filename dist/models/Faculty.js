"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faculty = void 0;
const mongoose_1 = require("mongoose");
const facultySchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    subject: { type: String },
    department: { type: String },
    experience: { type: String },
    qualification: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
}, {
    timestamps: true
});
exports.Faculty = (0, mongoose_1.model)("Faculty", facultySchema);
