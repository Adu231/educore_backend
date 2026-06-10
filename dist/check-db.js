"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Result_1 = require("./models/Result");
const User_1 = require("./models/User");
const env_1 = require("./config/env");
async function check() {
    await mongoose_1.default.connect(env_1.env.MONGODB_URI);
    console.log("Connected to db!");
    const results = await Result_1.Result.find({});
    console.log("Total results found:", results.length);
    for (const r of results) {
        console.log(`Student ID: ${r.studentId}, Semester: ${r.semester}, SGPA: ${r.sgpa}, CGPA: ${r.cgpa}, subjects count: ${r.subjects.length}`);
    }
    const students = await User_1.User.find({ role: "student" });
    console.log("Total students found:", students.length);
    for (const s of students) {
        console.log(`Student ID: ${s.id}, Name: ${s.name}, Semester: ${s.semester}, Department: ${s.department}, CGPA: ${s.cgpa}`);
    }
    await mongoose_1.default.disconnect();
}
check().catch(console.error);
