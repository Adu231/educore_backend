"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const response_1 = require("../utils/response");
class AdminController {
    /**
     * Get main metrics
     */
    static async getMetrics(req, res, next) {
        try {
            const metrics = await admin_service_1.AdminService.getMetrics();
            return response_1.ResponseHandler.success(res, metrics);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all students directory
     */
    static async getStudents(req, res, next) {
        try {
            const students = await admin_service_1.AdminService.getStudents();
            return response_1.ResponseHandler.success(res, students);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Add a new student record
     */
    static async createStudent(req, res, next) {
        try {
            const student = await admin_service_1.AdminService.createStudent(req.body);
            return response_1.ResponseHandler.success(res, { message: "Student record created successfully.", student }, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Edit student record details
     */
    static async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const student = await admin_service_1.AdminService.updateStudent(id, req.body);
            return response_1.ResponseHandler.success(res, { message: "Student record updated successfully.", student });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete student record
     */
    static async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            await admin_service_1.AdminService.deleteStudent(id);
            return response_1.ResponseHandler.success(res, { message: "Student record deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get notice board announcements
     */
    static async getNotices(req, res, next) {
        try {
            const notices = await admin_service_1.AdminService.getNotices();
            return response_1.ResponseHandler.success(res, notices);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Publish notice bulletin
     */
    static async createNotice(req, res, next) {
        try {
            const notice = await admin_service_1.AdminService.createNotice(req.body);
            return response_1.ResponseHandler.success(res, { message: "Notice bulletin published successfully.", notice }, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update notice details
     */
    static async updateNotice(req, res, next) {
        try {
            const { id } = req.params;
            const notice = await admin_service_1.AdminService.updateNotice(id, req.body);
            return response_1.ResponseHandler.success(res, { message: "Notice updated successfully.", notice });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a notice
     */
    static async deleteNotice(req, res, next) {
        try {
            const { id } = req.params;
            await admin_service_1.AdminService.deleteNotice(id);
            return response_1.ResponseHandler.success(res, { message: "Notice deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Toggle notice publish flag
     */
    static async toggleNoticePublish(req, res, next) {
        try {
            const { id } = req.params;
            const { published } = req.body;
            const notice = await admin_service_1.AdminService.toggleNoticePublish(id, published);
            return response_1.ResponseHandler.success(res, { message: `Notice ${published ? "published" : "drafted"} successfully.`, notice });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get timetable layouts
     */
    static async getTimetables(req, res, next) {
        try {
            const { semester } = req.query;
            const schedules = await admin_service_1.AdminService.getTimetables(semester);
            return response_1.ResponseHandler.success(res, schedules);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create a new timetable layout day
     */
    static async createTimetable(req, res, next) {
        try {
            const timetable = await admin_service_1.AdminService.createTimetable(req.body);
            return response_1.ResponseHandler.success(res, { message: "Timetable created successfully.", timetable }, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update timetable schedule slots
     */
    static async updateTimetableSlot(req, res, next) {
        try {
            const { day, index } = req.params;
            const { semester } = req.query;
            const timetable = await admin_service_1.AdminService.updateTimetableSlot(day, index, req.body, semester);
            return response_1.ResponseHandler.success(res, { message: "Timetable schedule slot updated successfully.", timetable });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a timetable slot
     */
    static async deleteTimetableSlot(req, res, next) {
        try {
            const { day, index } = req.params;
            const { semester } = req.query;
            const timetable = await admin_service_1.AdminService.deleteTimetableSlot(day, index, semester);
            return response_1.ResponseHandler.success(res, { message: "Timetable slot deleted successfully.", timetable });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all student academic results
     */
    static async getAllResults(req, res, next) {
        try {
            const results = await admin_service_1.AdminService.getAllResults();
            return response_1.ResponseHandler.success(res, results);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get results for student
     */
    static async getStudentResults(req, res, next) {
        try {
            const { id } = req.params;
            const results = await admin_service_1.AdminService.getStudentResults(id);
            return response_1.ResponseHandler.success(res, results);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Publish results for student semester
     */
    static async publishResult(req, res, next) {
        try {
            const { id } = req.params;
            const result = await admin_service_1.AdminService.publishResult(id, req.body);
            return response_1.ResponseHandler.success(res, { message: "Semester results successfully published.", result }, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete student result semester record
     */
    static async deleteResult(req, res, next) {
        try {
            const { id, semester } = req.params;
            await admin_service_1.AdminService.deleteResult(id, semester);
            return response_1.ResponseHandler.success(res, { message: "Semester record deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update semester result GPAs
     */
    static async updateResultGpa(req, res, next) {
        try {
            const { id, semester } = req.params;
            const { sgpa, cgpa } = req.body;
            const result = await admin_service_1.AdminService.updateResultGpa(id, semester, sgpa, cgpa);
            return response_1.ResponseHandler.success(res, { message: "GPAs updated successfully.", result });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Add subject slot to result
     */
    static async addSubjectToResult(req, res, next) {
        try {
            const { id, semester } = req.params;
            const result = await admin_service_1.AdminService.addSubjectToResult(id, semester, req.body);
            return response_1.ResponseHandler.success(res, { message: "Subject record added successfully.", result });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update subject slot details in result
     */
    static async updateSubjectInResult(req, res, next) {
        try {
            const { id, semester, index } = req.params;
            const result = await admin_service_1.AdminService.updateSubjectInResult(id, semester, index, req.body);
            return response_1.ResponseHandler.success(res, { message: "Subject record updated successfully.", result });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Remove subject slot from result
     */
    static async deleteSubjectFromResult(req, res, next) {
        try {
            const { id, semester, index } = req.params;
            const result = await admin_service_1.AdminService.deleteSubjectFromResult(id, semester, index);
            return response_1.ResponseHandler.success(res, { message: "Subject record deleted successfully.", result });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get enrollment graph analytics data
     */
    static async getEnrollmentGrowth(req, res, next) {
        try {
            const growth = await admin_service_1.AdminService.getEnrollmentGrowth();
            return response_1.ResponseHandler.success(res, growth);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all faculty records
     */
    static async getFaculty(req, res, next) {
        try {
            const facultyList = await admin_service_1.AdminService.getFaculty();
            return response_1.ResponseHandler.success(res, facultyList);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create a new faculty member record
     */
    static async createFaculty(req, res, next) {
        try {
            const faculty = await admin_service_1.AdminService.createFaculty(req.body);
            return response_1.ResponseHandler.success(res, { message: "Faculty record created successfully.", faculty }, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update details of an existing faculty member
     */
    static async updateFaculty(req, res, next) {
        try {
            const { id } = req.params;
            const faculty = await admin_service_1.AdminService.updateFaculty(id, req.body);
            return response_1.ResponseHandler.success(res, { message: "Faculty record updated successfully.", faculty });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a faculty member record
     */
    static async deleteFaculty(req, res, next) {
        try {
            const { id } = req.params;
            await admin_service_1.AdminService.deleteFaculty(id);
            return response_1.ResponseHandler.success(res, { message: "Faculty record deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Retrieve all assignments
     */
    static async getAssignments(req, res, next) {
        try {
            const assignments = await admin_service_1.AdminService.getAssignments();
            return response_1.ResponseHandler.success(res, assignments);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create new assignments
     */
    static async createAssignment(req, res, next) {
        try {
            const result = await admin_service_1.AdminService.createAssignment(req.body);
            return response_1.ResponseHandler.success(res, result, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete an assignment
     */
    static async deleteAssignment(req, res, next) {
        try {
            const { id } = req.params;
            const result = await admin_service_1.AdminService.deleteAssignment(id);
            return response_1.ResponseHandler.success(res, { message: "Assignment deleted successfully.", assignment: result });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Grade a student's assignment submission
     */
    static async gradeAssignment(req, res, next) {
        try {
            const { id } = req.params;
            const { marks } = req.body;
            const result = await admin_service_1.AdminService.gradeAssignment(id, Number(marks));
            return response_1.ResponseHandler.success(res, { message: "Assignment graded successfully.", assignment: result });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get detailed subject-wise attendance for a student
     */
    static async getStudentAttendance(req, res, next) {
        try {
            const { id } = req.params;
            const attendance = await admin_service_1.AdminService.getStudentAttendance(id);
            return response_1.ResponseHandler.success(res, attendance);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all admin-configured subject details
     */
    static async getSubjectDetails(req, res, next) {
        try {
            const details = await admin_service_1.AdminService.getSubjectDetails();
            return response_1.ResponseHandler.success(res, details);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create or update subject configuration
     */
    static async upsertSubjectDetails(req, res, next) {
        try {
            const result = await admin_service_1.AdminService.upsertSubjectDetails(req.body);
            return response_1.ResponseHandler.success(res, { message: "Subject details updated successfully.", data: result });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete subject configuration
     */
    static async deleteSubjectDetails(req, res, next) {
        try {
            const { id } = req.params;
            await admin_service_1.AdminService.deleteSubjectDetails(id);
            return response_1.ResponseHandler.success(res, { message: "Subject configuration deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Retrieve all administrators
     */
    static async getAdmins(req, res, next) {
        try {
            const admins = await admin_service_1.AdminService.getAdmins();
            return response_1.ResponseHandler.success(res, admins);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create a new administrator account
     */
    static async createAdmin(req, res, next) {
        try {
            const admin = await admin_service_1.AdminService.createAdmin(req.body);
            return response_1.ResponseHandler.success(res, { message: "Administrator account created successfully.", admin }, 201);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update an administrator account
     */
    static async updateAdmin(req, res, next) {
        try {
            const { id } = req.params;
            const admin = await admin_service_1.AdminService.updateAdmin(id, req.body);
            return response_1.ResponseHandler.success(res, { message: "Administrator account updated successfully.", admin });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete an administrator account
     */
    static async deleteAdmin(req, res, next) {
        try {
            const { id } = req.params;
            const currentAdminId = req.user?.id;
            await admin_service_1.AdminService.deleteAdmin(currentAdminId, id);
            return response_1.ResponseHandler.success(res, { message: "Administrator account deleted successfully." });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
