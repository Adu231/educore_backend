"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./config/env");
const User_1 = require("./models/User");
const Attendance_1 = require("./models/Attendance");
const AttendanceTrend_1 = require("./models/AttendanceTrend");
const Assignment_1 = require("./models/Assignment");
const Timetable_1 = require("./models/Timetable");
const Notice_1 = require("./models/Notice");
const BlogPost_1 = require("./models/BlogPost");
const Result_1 = require("./models/Result");
const Faculty_1 = require("./models/Faculty");
const SubjectDetails_1 = require("./models/SubjectDetails");
const ContactMessage_1 = require("./models/ContactMessage");
const Newsletter_1 = require("./models/Newsletter");
const Transaction_1 = require("./models/Transaction");
const wipeDatabase = async () => {
    try {
        console.log("Connecting to database: " + env_1.env.MONGODB_URI);
        await mongoose_1.default.connect(env_1.env.MONGODB_URI);
        console.log("Successfully connected! Wiping all collections...");
        // Delete all documents in all collections
        const deleteOps = [
            User_1.User.deleteMany({}),
            Attendance_1.Attendance.deleteMany({}),
            AttendanceTrend_1.AttendanceTrend.deleteMany({}),
            Assignment_1.Assignment.deleteMany({}),
            Timetable_1.Timetable.deleteMany({}),
            Notice_1.Notice.deleteMany({}),
            BlogPost_1.BlogPost.deleteMany({}),
            Result_1.Result.deleteMany({}),
            Faculty_1.Faculty.deleteMany({}),
            SubjectDetails_1.SubjectDetails.deleteMany({}),
            ContactMessage_1.ContactMessage.deleteMany({}),
            Newsletter_1.Newsletter.deleteMany({}),
            Transaction_1.Transaction.deleteMany({})
        ];
        await Promise.all(deleteOps);
        console.log("All collections wiped completely clean!");
        console.log("Closing connection...");
        await mongoose_1.default.connection.close();
        console.log("Database connection closed successfully.");
        process.exit(0);
    }
    catch (err) {
        console.error("Database wipe failed:", err);
        process.exit(1);
    }
};
wipeDatabase();
