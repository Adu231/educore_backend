"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Attendance_1 = require("../models/Attendance");
const AttendanceTrend_1 = require("../models/AttendanceTrend");
const Assignment_1 = require("../models/Assignment");
const Result_1 = require("../models/Result");
const Timetable_1 = require("../models/Timetable");
const router = (0, express_1.Router)();
// Apply student authorization guards to all student routes
router.use(auth_1.authMiddleware);
router.use((0, auth_1.roleGuard)(["student"]));
// Get Attendance Records
router.get("/attendance", async (req, res) => {
    const studentId = req.user?.id;
    try {
        const records = await Attendance_1.Attendance.find({ studentId });
        return res.json(records);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to load attendance records." });
    }
});
// Get Monthly Attendance Trend
router.get("/attendance/trend", async (req, res) => {
    const studentId = req.user?.id;
    try {
        const trends = await AttendanceTrend_1.AttendanceTrend.find({ studentId }).sort({ createdAt: 1 });
        return res.json(trends);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to load attendance trend." });
    }
});
// Get Assignments List
router.get("/assignments", async (req, res) => {
    const studentId = req.user?.id;
    try {
        const assignments = await Assignment_1.Assignment.find({ studentId });
        return res.json(assignments);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to load assignments list." });
    }
});
// Submit Assignment File
router.post("/assignments/:id/submit", async (req, res) => {
    const { id } = req.params;
    const { fileUrl, notes } = req.body; // accept simulated url upload
    const studentId = req.user?.id;
    if (!fileUrl) {
        return res.status(400).json({ error: "File URL is required." });
    }
    try {
        const assignment = await Assignment_1.Assignment.findOne({ _id: id, studentId });
        if (!assignment) {
            return res.status(404).json({ error: "Assignment not found." });
        }
        assignment.status = "submitted";
        assignment.submission = {
            fileUrl,
            notes,
            submittedAt: new Date()
        };
        await assignment.save();
        return res.json({
            message: "Assignment submitted successfully",
            submittedAt: assignment.submission.submittedAt,
            status: assignment.status
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Assignment submission failed." });
    }
});
// Get Academic Results
router.get("/results", async (req, res) => {
    const studentId = req.user?.id;
    try {
        const results = await Result_1.Result.find({ studentId }).sort({ semester: -1 });
        return res.json(results);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to load results." });
    }
});
// Get Timetable
router.get("/timetable", async (req, res) => {
    try {
        // Return all timetable schedules (which applies to the student class/department)
        const timetable = await Timetable_1.Timetable.find({});
        // Format response back as day keys
        const response = {};
        timetable.forEach(t => {
            response[t.day] = t.slots;
        });
        return res.json(response);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to load timetable." });
    }
});
exports.default = router;
