"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const student_service_1 = require("../services/student.service");
const response_1 = require("../utils/response");
const errors_1 = require("../utils/errors");
class StudentController {
    /**
     * Get student's attendance records
     */
    static async getAttendance(req, res, next) {
        try {
            const studentId = req.user?.id;
            if (!studentId) {
                throw new errors_1.BadRequestError("Student authentication context missing.");
            }
            const records = await student_service_1.StudentService.getAttendance(studentId);
            return response_1.ResponseHandler.success(res, records);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get student's attendance monthly trends
     */
    static async getAttendanceTrend(req, res, next) {
        try {
            const studentId = req.user?.id;
            if (!studentId) {
                throw new errors_1.BadRequestError("Student authentication context missing.");
            }
            const trends = await student_service_1.StudentService.getAttendanceTrend(studentId);
            return response_1.ResponseHandler.success(res, trends);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get student's assignments
     */
    static async getAssignments(req, res, next) {
        try {
            const studentId = req.user?.id;
            if (!studentId) {
                throw new errors_1.BadRequestError("Student authentication context missing.");
            }
            const assignments = await student_service_1.StudentService.getAssignments(studentId);
            return response_1.ResponseHandler.success(res, assignments);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Submit an assignment
     */
    static async submitAssignment(req, res, next) {
        try {
            const studentId = req.user?.id;
            if (!studentId) {
                throw new errors_1.BadRequestError("Student authentication context missing.");
            }
            const { id } = req.params;
            const { fileUrl, notes } = req.body;
            const result = await student_service_1.StudentService.submitAssignment(studentId, id, fileUrl, notes);
            return response_1.ResponseHandler.success(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get student's academic results
     */
    static async getResults(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new errors_1.BadRequestError("Student ID parameter is missing.");
            }
            const results = await student_service_1.StudentService.getResults(id);
            return response_1.ResponseHandler.success(res, results);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get department classes timetables
     */
    static async getTimetable(req, res, next) {
        try {
            const studentId = req.user?.id;
            if (!studentId) {
                throw new errors_1.BadRequestError("Student authentication context missing.");
            }
            const timetable = await student_service_1.StudentService.getTimetable(studentId);
            return response_1.ResponseHandler.success(res, timetable);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Add or update student attendance record subject-wise
     */
    static async addOrUpdateAttendance(req, res, next) {
        try {
            const studentId = req.user?.id;
            if (!studentId) {
                throw new errors_1.BadRequestError("Student authentication context missing.");
            }
            const { subject, attended, totalClasses } = req.body;
            const result = await student_service_1.StudentService.addOrUpdateAttendance(studentId, subject, Number(attended), totalClasses !== undefined ? Number(totalClasses) : undefined);
            return response_1.ResponseHandler.success(res, { message: "Subject attendance updated successfully.", record: result });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get configured subjects details for student department/semester
     */
    static async getSubjectDetails(req, res, next) {
        try {
            const studentId = req.user?.id;
            if (!studentId) {
                throw new errors_1.BadRequestError("Student authentication context missing.");
            }
            const details = await student_service_1.StudentService.getSubjectDetailsByStudentId(studentId);
            return response_1.ResponseHandler.success(res, details);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StudentController = StudentController;
