"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["student", "admin"] },
    avatar: { type: String },
    rollNumber: { type: String },
    department: { type: String },
    semester: { type: String },
    phone: { type: String },
    address: { type: String },
    joinDate: { type: String },
    attendance: { type: Number },
    cgpa: { type: Number },
    status: { type: String, enum: ["active", "warning", "at-risk", "on-leave"], default: "active" },
    profileCompleted: { type: Boolean, default: false }
}, {
    timestamps: true
});
// Compare password
userSchema.methods.comparePassword = async function (password) {
    return bcryptjs_1.default.compare(password, this.passwordHash);
};
exports.User = (0, mongoose_1.model)("User", userSchema);
