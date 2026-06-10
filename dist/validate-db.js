"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("./models/User");
const Notice_1 = require("./models/Notice");
const Result_1 = require("./models/Result");
const Timetable_1 = require("./models/Timetable");
const Faculty_1 = require("./models/Faculty");
const Assignment_1 = require("./models/Assignment");
const Attendance_1 = require("./models/Attendance");
const AttendanceTrend_1 = require("./models/AttendanceTrend");
const SubjectDetails_1 = require("./models/SubjectDetails");
const env_1 = require("./config/env");
async function run() {
    await mongoose_1.default.connect(env_1.env.MONGODB_URI);
    console.log("Connected to db successfully.");
    const collections = [
        { name: "User", model: User_1.User },
        { name: "Notice", model: Notice_1.Notice },
        { name: "Result", model: Result_1.Result },
        { name: "Timetable", model: Timetable_1.Timetable },
        { name: "Faculty", model: Faculty_1.Faculty },
        { name: "Assignment", model: Assignment_1.Assignment },
        { name: "Attendance", model: Attendance_1.Attendance },
        { name: "AttendanceTrend", model: AttendanceTrend_1.AttendanceTrend },
        { name: "SubjectDetails", model: SubjectDetails_1.SubjectDetails },
    ];
    for (const col of collections) {
        const count = await col.model.countDocuments({});
        console.log(`Collection: ${col.name}, Document Count: ${count}`);
        try {
            const docs = await col.model.find({});
            for (const doc of docs) {
                const err = doc.validateSync?.();
                if (err) {
                    console.error(`Validation error in ${col.name} document ID ${doc._id || doc.id}:`, err.message);
                }
            }
        }
        catch (err) {
            console.error(`Error validating collection ${col.name}:`, err.message);
        }
    }
    await mongoose_1.default.disconnect();
    console.log("Disconnected from db.");
}
run().catch(console.error);
