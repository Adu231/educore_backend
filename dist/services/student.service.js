"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const Attendance_1 = require("../models/Attendance");
const AttendanceTrend_1 = require("../models/AttendanceTrend");
const Assignment_1 = require("../models/Assignment");
const Result_1 = require("../models/Result");
const Timetable_1 = require("../models/Timetable");
const User_1 = require("../models/User");
const SubjectDetails_1 = require("../models/SubjectDetails");
const errors_1 = require("../utils/errors");
const normalizeSemester = (sem) => {
    const match = sem.match(/(\d+)/);
    if (!match)
        return sem;
    const num = match[1];
    let suffix = "th";
    if (num === "1")
        suffix = "st";
    else if (num === "2")
        suffix = "nd";
    else if (num === "3")
        suffix = "rd";
    return `${num}${suffix}`;
};
class StudentService {
    /**
     * Get student attendance records
     */
    static async getAttendance(studentId) {
        return Attendance_1.Attendance.find({ studentId });
    }
    /**
     * Get monthly attendance trends
     */
    static async getAttendanceTrend(studentId) {
        return AttendanceTrend_1.AttendanceTrend.find({ studentId }).sort({ createdAt: 1 });
    }
    /**
     * Get student assignments
     */
    static async getAssignments(studentId) {
        return Assignment_1.Assignment.find({ studentId });
    }
    /**
     * Submit an assignment
     */
    static async submitAssignment(studentId, assignmentId, fileUrl, notes) {
        if (!fileUrl) {
            throw new errors_1.BadRequestError("File URL is required.");
        }
        const assignment = await Assignment_1.Assignment.findOne({ _id: assignmentId, studentId });
        if (!assignment) {
            throw new errors_1.NotFoundError("Assignment not found.");
        }
        assignment.status = "submitted";
        assignment.submission = {
            fileUrl,
            notes,
            submittedAt: new Date()
        };
        await assignment.save();
        return {
            message: "Assignment submitted successfully",
            submittedAt: assignment.submission.submittedAt,
            status: assignment.status
        };
    }
    /**
     * Get student results
     */
    static async getResults(studentId) {
        return Result_1.Result.find({ studentId }).sort({ semester: 1 });
    }
    /**
     * Get student's semester-specific timetable
     */
    static async getTimetable(studentId) {
        const student = await User_1.User.findOne({ id: studentId });
        if (!student) {
            throw new errors_1.NotFoundError("Student profile not found.");
        }
        const normSem = normalizeSemester(student.semester || "Pending");
        return Timetable_1.Timetable.find({ semester: normSem });
    }
    /**
     * Add or update subject-wise attendance for a student
     */
    static async addOrUpdateAttendance(studentId, subject, attended, customTotal) {
        if (!subject) {
            throw new errors_1.BadRequestError("Subject name is required.");
        }
        if (attended === undefined || attended === null) {
            throw new errors_1.BadRequestError("Attended classes count is required.");
        }
        if (attended < 0) {
            throw new errors_1.BadRequestError("Attended classes count must be non-negative.");
        }
        const student = await User_1.User.findOne({ id: studentId });
        if (!student) {
            throw new errors_1.NotFoundError("Student profile not found.");
        }
        const dept = student.department || "General";
        const sem = student.semester || "Pending";
        const normSem = normalizeSemester(sem);
        let total;
        const config = await SubjectDetails_1.SubjectDetails.findOne({ department: dept, semester: normSem, subject });
        if (!config) {
            if (customTotal !== undefined && customTotal !== null) {
                total = customTotal;
            }
            else {
                throw new errors_1.BadRequestError(`Subject "${subject}" is not configured by the admin for department "${dept}" and semester "${sem}".`);
            }
        }
        else {
            total = config.totalClasses;
        }
        if (attended > total) {
            throw new errors_1.BadRequestError(`Attended classes (${attended}) cannot exceed total classes held (${total}).`);
        }
        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
        let record = await Attendance_1.Attendance.findOne({ studentId, subject });
        if (record) {
            record.total = total;
            record.attended = attended;
            record.percentage = percentage;
            await record.save();
        }
        else {
            record = new Attendance_1.Attendance({
                studentId,
                subject,
                total,
                attended,
                percentage
            });
            await record.save();
        }
        // Recalculate overall average attendance percentage
        const allRecords = await Attendance_1.Attendance.find({ studentId });
        const overallPercentage = allRecords.length > 0
            ? Math.round(allRecords.reduce((sum, r) => sum + (r.percentage || 0), 0) / allRecords.length)
            : 100;
        // Update user profile record
        await User_1.User.findOneAndUpdate({ id: studentId }, { $set: { attendance: overallPercentage } });
        // Update AttendanceTrend for the current month
        const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
        await AttendanceTrend_1.AttendanceTrend.findOneAndUpdate({ studentId, month: currentMonth }, { $set: { attendance: overallPercentage } }, { upsert: true, new: true });
        return record;
    }
    /**
     * Get configured subjects details for a student's department and semester
     */
    static async getSubjectDetails(department, semester) {
        return SubjectDetails_1.SubjectDetails.find({ department, semester }).sort({ subject: 1 });
    }
    /**
     * Get configured subjects details scoped by studentId
     */
    static async getSubjectDetailsByStudentId(studentId) {
        const student = await User_1.User.findOne({ id: studentId });
        if (!student) {
            throw new errors_1.NotFoundError("Student profile not found.");
        }
        const normSem = normalizeSemester(student.semester || "Pending");
        return this.getSubjectDetails(student.department || "General", normSem);
    }
}
exports.StudentService = StudentService;
