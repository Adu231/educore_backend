"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const User_1 = require("../models/User");
const Notice_1 = require("../models/Notice");
const Result_1 = require("../models/Result");
const Timetable_1 = require("../models/Timetable");
const Faculty_1 = require("../models/Faculty");
const Assignment_1 = require("../models/Assignment");
const Attendance_1 = require("../models/Attendance");
const AttendanceTrend_1 = require("../models/AttendanceTrend");
const SubjectDetails_1 = require("../models/SubjectDetails");
const errors_1 = require("../utils/errors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
class AdminService {
    /**
     * Helper to calculate grade based on score
     */
    static calculateGrade(score) {
        if (score >= 90)
            return "A+";
        if (score >= 80)
            return "A";
        if (score >= 70)
            return "B+";
        if (score >= 60)
            return "B";
        if (score >= 50)
            return "C";
        return "F";
    }
    /**
     * Helper to recalculate CGPA for a student
     */
    static async recalculateCGPA(studentId) {
        const results = await Result_1.Result.find({ studentId });
        if (results.length === 0)
            return 0.0;
        const sumSgpa = results.reduce((sum, r) => sum + r.sgpa, 0);
        return Number((sumSgpa / results.length).toFixed(2));
    }
    /**
     * Get core dashboard metrics using real database records
     */
    static async getMetrics() {
        const totalStudents = await User_1.User.countDocuments({ role: "student" });
        const totalFaculty = await Faculty_1.Faculty.countDocuments({});
        const activeNotices = await Notice_1.Notice.countDocuments({ published: true });
        // Calculate dynamic average attendanceRate for all student users
        const students = await User_1.User.find({ role: "student" });
        const attendanceRate = students.length > 0
            ? Number((students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length).toFixed(1))
            : 0;
        // Calculate dynamic passRate from student Results (non-F subjects percentage)
        const results = await Result_1.Result.find({});
        let totalSubjectsCount = 0;
        let passedSubjectsCount = 0;
        results.forEach((r) => {
            if (r.subjects && Array.isArray(r.subjects)) {
                r.subjects.forEach((sub) => {
                    totalSubjectsCount++;
                    if (sub.grade !== "F") {
                        passedSubjectsCount++;
                    }
                });
            }
        });
        const passRate = totalSubjectsCount > 0
            ? Number((passedSubjectsCount / totalSubjectsCount * 100).toFixed(1))
            : 100.0;
        // Retrieve total distinct subjects configured
        const totalCourses = await SubjectDetails_1.SubjectDetails.distinct("subject").then(res => res.length);
        // Dynamic department breakdown
        const allDepts = Array.from(new Set([
            ...(await User_1.User.distinct("department", { role: "student" })),
            ...(await Faculty_1.Faculty.distinct("department")),
            ...(await SubjectDetails_1.SubjectDetails.distinct("department"))
        ].filter(Boolean)));
        const departmentStats = await Promise.all(allDepts.map(async (dept) => {
            const studentCount = await User_1.User.countDocuments({ role: "student", department: dept });
            const facultyCount = await Faculty_1.Faculty.countDocuments({ department: dept });
            const courseCount = await SubjectDetails_1.SubjectDetails.countDocuments({ department: dept });
            return {
                name: dept,
                students: studentCount,
                faculty: facultyCount,
                courses: courseCount
            };
        }));
        return {
            totalStudents,
            totalFaculty,
            totalCourses,
            activeNotices,
            attendanceRate,
            passRate,
            departmentStats
        };
    }
    /**
     * Retrieve all students
     */
    static async getStudents() {
        return User_1.User.find({ role: "student" });
    }
    /**
     * Create a new student record
     */
    static async createStudent(data) {
        const { id, name, email, phone, department, semester, attendance, cgpa, status } = data;
        if (!id || !name || !email) {
            throw new errors_1.BadRequestError("ID, Name, and Email are required.");
        }
        if (phone && !/^\d{10}$/.test(phone)) {
            throw new errors_1.BadRequestError("Mobile number must be exactly 10 digits.");
        }
        const existing = await User_1.User.findOne({ id });
        if (existing) {
            throw new errors_1.BadRequestError("Student ID already exists.");
        }
        const newStudent = new User_1.User({
            id,
            name,
            email: email.toLowerCase(),
            phone,
            department,
            semester,
            attendance: attendance || 100,
            cgpa: cgpa || 0.0,
            status: status || "active",
            role: "student",
            rollNumber: id,
            passwordHash: "$2a$10$7R15o63fD2uC2r9Y7U3f9.4c72r9r9r9r9r9r9r9r9r9r9" // default hashed password 'demo123'
        });
        await newStudent.save();
        return newStudent;
    }
    /**
     * Update student details
     */
    static async updateStudent(id, data) {
        const { name, email, phone, department, semester, attendance, cgpa, status } = data;
        if (phone && !/^\d{10}$/.test(phone)) {
            throw new errors_1.BadRequestError("Mobile number must be exactly 10 digits.");
        }
        const student = await User_1.User.findOneAndUpdate({ id, role: "student" }, { $set: { name, email: email?.toLowerCase(), phone, department, semester, attendance, cgpa, status } }, { new: true });
        if (!student) {
            throw new errors_1.NotFoundError("Student not found.");
        }
        return student;
    }
    /**
     * Delete student record
     */
    static async deleteStudent(id) {
        const student = await User_1.User.findOneAndDelete({ id, role: "student" });
        if (!student) {
            throw new errors_1.NotFoundError("Student not found.");
        }
        return student;
    }
    /**
     * Retrieve all notices
     */
    static async getNotices() {
        return Notice_1.Notice.find({}).sort({ createdAt: -1 });
    }
    /**
     * Create a new bulletin notice
     */
    static async createNotice(data) {
        const { title, category, date, priority, content, published } = data;
        if (!title || !category || !content) {
            throw new errors_1.BadRequestError("Title, category, and content are required.");
        }
        const notice = new Notice_1.Notice({
            title,
            category,
            date: date || new Date().toISOString().split("T")[0],
            priority: priority || "medium",
            content,
            published: published || false
        });
        await notice.save();
        return notice;
    }
    /**
     * Update notice details
     */
    static async updateNotice(id, data) {
        const { title, category, priority, content, published } = data;
        const notice = await Notice_1.Notice.findByIdAndUpdate(id, { $set: { title, category, priority, content, published } }, { new: true });
        if (!notice) {
            throw new errors_1.NotFoundError("Notice not found.");
        }
        return notice;
    }
    /**
     * Delete a notice
     */
    static async deleteNotice(id) {
        const notice = await Notice_1.Notice.findByIdAndDelete(id);
        if (!notice) {
            throw new errors_1.NotFoundError("Notice not found.");
        }
        return notice;
    }
    /**
     * Toggle published state of a notice
     */
    static async toggleNoticePublish(id, published) {
        const notice = await Notice_1.Notice.findByIdAndUpdate(id, { $set: { published } }, { new: true });
        if (!notice) {
            throw new errors_1.NotFoundError("Notice not found.");
        }
        return notice;
    }
    /**
     * Get all timetables, optionally filtered by semester
     */
    static async getTimetables(semester) {
        const filter = semester ? { semester } : {};
        return Timetable_1.Timetable.find(filter);
    }
    /**
     * Create a new day timetable
     */
    static async createTimetable(data) {
        const { day, slots, roleScope, semester } = data;
        if (!day) {
            throw new errors_1.BadRequestError("Day is required.");
        }
        const targetSem = semester || "6th";
        const existing = await Timetable_1.Timetable.findOne({ day, semester: targetSem });
        if (existing) {
            throw new errors_1.BadRequestError(`Timetable for ${day} (${targetSem} Sem) already exists.`);
        }
        const newTimetable = new Timetable_1.Timetable({
            day,
            slots: slots || [],
            roleScope: roleScope || "all",
            semester: targetSem
        });
        await newTimetable.save();
        return newTimetable;
    }
    /**
     * Update a timetable slot
     */
    static async updateTimetableSlot(day, indexStr, slotData, semester = "6th") {
        const index = Number(indexStr);
        const { time, subject, room, faculty } = slotData;
        let t = await Timetable_1.Timetable.findOne({ day, semester });
        if (!t) {
            t = new Timetable_1.Timetable({ day, semester, slots: [], roleScope: "all" });
        }
        const slotPayload = { time, subject, room, faculty };
        if (index >= 0 && index < t.slots.length) {
            t.slots[index] = slotPayload;
        }
        else {
            t.slots.push(slotPayload);
        }
        await t.save();
        return t;
    }
    /**
     * Delete a timetable slot
     */
    static async deleteTimetableSlot(day, indexStr, semester = "6th") {
        const index = Number(indexStr);
        const t = await Timetable_1.Timetable.findOne({ day, semester });
        if (!t || index < 0 || index >= t.slots.length) {
            throw new errors_1.NotFoundError("Timetable day or slot index not found.");
        }
        t.slots.splice(index, 1);
        await t.save();
        return t;
    }
    /**
     * Get all student academic results
     */
    static async getAllResults() {
        return Result_1.Result.find({}).sort({ studentId: 1, semester: 1 });
    }
    /**
     * Get specific student academic results
     */
    static async getStudentResults(studentId) {
        return Result_1.Result.find({ studentId }).sort({ semester: 1 });
    }
    /**
     * Publish results for a student's semester
     */
    static async publishResult(studentId, data) {
        const { semester, year, subjects } = data;
        if (!semester || !year || !subjects || !Array.isArray(subjects)) {
            throw new errors_1.BadRequestError("Semester, year, and subject list are required.");
        }
        const existing = await Result_1.Result.findOne({ studentId, semester });
        if (existing) {
            throw new errors_1.BadRequestError(`Results for ${semester} have already been published for this student.`);
        }
        const compiledSubjects = subjects.map((sub) => {
            const internal = Number(sub.internal) || 0;
            const external = Number(sub.external) || 0;
            const total = internal + external;
            return {
                name: sub.name,
                internal,
                external,
                total,
                grade: this.calculateGrade(total)
            };
        });
        const totalSum = compiledSubjects.reduce((sum, s) => sum + s.total, 0);
        const sgpa = compiledSubjects.length > 0 ? Number((totalSum / compiledSubjects.length / 10).toFixed(2)) : 0.0;
        const existingResults = await Result_1.Result.find({ studentId });
        let cgpa = sgpa;
        if (existingResults.length > 0) {
            const sumSgpa = existingResults.reduce((sum, r) => sum + r.sgpa, 0) + sgpa;
            cgpa = Number((sumSgpa / (existingResults.length + 1)).toFixed(2));
        }
        const newResult = new Result_1.Result({
            studentId,
            semester,
            year,
            subjects: compiledSubjects,
            sgpa,
            cgpa
        });
        await newResult.save();
        // Update overall CGPA in student user profile
        await User_1.User.findOneAndUpdate({ id: studentId }, { $set: { cgpa } });
        return newResult;
    }
    /**
     * Delete result record
     */
    static async deleteResult(studentId, semester) {
        const deleted = await Result_1.Result.findOneAndDelete({ studentId, semester });
        if (!deleted) {
            throw new errors_1.NotFoundError("Semester results not found.");
        }
        // Recompute and update student CGPA
        const cgpa = await this.recalculateCGPA(studentId);
        await User_1.User.findOneAndUpdate({ id: studentId }, { $set: { cgpa } });
        return deleted;
    }
    /**
     * Update Result GPAs
     */
    static async updateResultGpa(studentId, semester, sgpa, cgpa) {
        const result = await Result_1.Result.findOneAndUpdate({ studentId, semester }, { $set: { sgpa: Number(sgpa), cgpa: Number(cgpa) } }, { new: true });
        if (!result) {
            throw new errors_1.NotFoundError("Semester results not found.");
        }
        await User_1.User.findOneAndUpdate({ id: studentId }, { $set: { cgpa: Number(cgpa) } });
        return result;
    }
    /**
     * Add a subject to a semester result
     */
    static async addSubjectToResult(studentId, semester, subjectData) {
        const { name, internal, external } = subjectData;
        const result = await Result_1.Result.findOne({ studentId, semester });
        if (!result) {
            throw new errors_1.NotFoundError("Semester record not found.");
        }
        const total = Number(internal) + Number(external);
        result.subjects.push({
            name,
            internal: Number(internal),
            external: Number(external),
            total,
            grade: this.calculateGrade(total)
        });
        // Recalculate SGPA
        const totalSum = result.subjects.reduce((sum, s) => sum + s.total, 0);
        result.sgpa = Number((totalSum / result.subjects.length / 10).toFixed(2));
        await result.save();
        // Recalculate and update CGPA
        const cgpa = await this.recalculateCGPA(studentId);
        result.cgpa = cgpa;
        await result.save();
        await User_1.User.findOneAndUpdate({ id: studentId }, { $set: { cgpa } });
        return result;
    }
    /**
     * Update a subject inside a semester result
     */
    static async updateSubjectInResult(studentId, semester, indexStr, subjectData) {
        const index = Number(indexStr);
        const { name, internal, external } = subjectData;
        const result = await Result_1.Result.findOne({ studentId, semester });
        if (!result || index < 0 || index >= result.subjects.length) {
            throw new errors_1.NotFoundError("Semester record or subject slot index not found.");
        }
        const total = Number(internal) + Number(external);
        result.subjects[index] = {
            name,
            internal: Number(internal),
            external: Number(external),
            total,
            grade: this.calculateGrade(total)
        };
        // Recalculate SGPA
        const totalSum = result.subjects.reduce((sum, s) => sum + s.total, 0);
        result.sgpa = Number((totalSum / result.subjects.length / 10).toFixed(2));
        await result.save();
        // Recalculate and update CGPA
        const cgpa = await this.recalculateCGPA(studentId);
        result.cgpa = cgpa;
        await result.save();
        await User_1.User.findOneAndUpdate({ id: studentId }, { $set: { cgpa } });
        return result;
    }
    /**
     * Delete a subject from a semester result
     */
    static async deleteSubjectFromResult(studentId, semester, indexStr) {
        const index = Number(indexStr);
        const result = await Result_1.Result.findOne({ studentId, semester });
        if (!result || index < 0 || index >= result.subjects.length) {
            throw new errors_1.NotFoundError("Semester record or subject slot index not found.");
        }
        result.subjects.splice(index, 1);
        if (result.subjects.length > 0) {
            const totalSum = result.subjects.reduce((sum, s) => sum + s.total, 0);
            result.sgpa = Number((totalSum / result.subjects.length / 10).toFixed(2));
        }
        else {
            result.sgpa = 0.0;
        }
        await result.save();
        // Recalculate and update CGPA
        const cgpa = await this.recalculateCGPA(studentId);
        result.cgpa = cgpa;
        await result.save();
        await User_1.User.findOneAndUpdate({ id: studentId }, { $set: { cgpa } });
        return result;
    }
    /**
     * Performance analytics trend data aggregated from the database (AttendanceTrend and Results)
     */
    static async getEnrollmentGrowth() {
        const trends = await AttendanceTrend_1.AttendanceTrend.find({});
        // Group attendance values by month
        const monthlyStats = {};
        trends.forEach((t) => {
            if (!monthlyStats[t.month]) {
                monthlyStats[t.month] = { attendanceSum: 0, count: 0 };
            }
            monthlyStats[t.month].attendanceSum += t.attendance;
            monthlyStats[t.month].count += 1;
        });
        const totalStudentsCount = await User_1.User.countDocuments({ role: "student" });
        // Calculate dynamic passRate from student Results (non-F subjects percentage)
        const results = await Result_1.Result.find({});
        let totalSubjectsCount = 0;
        let passedSubjectsCount = 0;
        results.forEach((r) => {
            if (r.subjects && Array.isArray(r.subjects)) {
                r.subjects.forEach((sub) => {
                    totalSubjectsCount++;
                    if (sub.grade !== "F") {
                        passedSubjectsCount++;
                    }
                });
            }
        });
        const overallPassRate = totalSubjectsCount > 0
            ? Math.round(passedSubjectsCount / totalSubjectsCount * 100)
            : 100;
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // Format final response array
        const result = Object.keys(monthlyStats).map(month => {
            const stats = monthlyStats[month];
            return {
                month,
                attendance: Math.round(stats.attendanceSum / stats.count),
                students: totalStudentsCount,
                passRate: overallPassRate
            };
        });
        // Sort months chronologically
        result.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
        // Fallback if no trends are in the database yet
        if (result.length === 0) {
            return [
                { month: "Jan", attendance: 90, students: totalStudentsCount, passRate: overallPassRate },
                { month: "Feb", attendance: 90, students: totalStudentsCount, passRate: overallPassRate },
                { month: "Mar", attendance: 90, students: totalStudentsCount, passRate: overallPassRate }
            ];
        }
        return result;
    }
    /**
     * Retrieve all faculty records
     */
    static async getFaculty() {
        return Faculty_1.Faculty.find({});
    }
    /**
     * Create a new faculty record
     */
    static async createFaculty(data) {
        const { id, name, email, phone } = data;
        if (!id || !name || !email) {
            throw new errors_1.BadRequestError("ID, Name, and Email are required.");
        }
        if (phone && !/^\d{10}$/.test(phone)) {
            throw new errors_1.BadRequestError("Mobile number must be exactly 10 digits.");
        }
        const existing = await Faculty_1.Faculty.findOne({ id });
        if (existing) {
            throw new errors_1.BadRequestError("Faculty ID already exists.");
        }
        const newFaculty = new Faculty_1.Faculty(data);
        await newFaculty.save();
        return newFaculty;
    }
    /**
     * Update a faculty record
     */
    static async updateFaculty(id, data) {
        const { phone } = data;
        if (phone && !/^\d{10}$/.test(phone)) {
            throw new errors_1.BadRequestError("Mobile number must be exactly 10 digits.");
        }
        const faculty = await Faculty_1.Faculty.findOneAndUpdate({ id }, { $set: data }, { new: true });
        if (!faculty) {
            throw new errors_1.NotFoundError("Faculty member not found.");
        }
        return faculty;
    }
    /**
     * Delete a faculty record
     */
    static async deleteFaculty(id) {
        const faculty = await Faculty_1.Faculty.findOneAndDelete({ id });
        if (!faculty) {
            throw new errors_1.NotFoundError("Faculty member not found.");
        }
        return faculty;
    }
    /**
     * Retrieve all assignments
     */
    static async getAssignments() {
        return Assignment_1.Assignment.find({}).sort({ createdAt: -1 });
    }
    /**
     * Create a new assignment
     */
    static async createAssignment(data) {
        const { title, subject, dueDate, maxMarks, description, studentId } = data;
        if (!title || !subject || !dueDate || !maxMarks || !description || !studentId) {
            throw new errors_1.BadRequestError("Title, subject, dueDate, maxMarks, description, and studentId are required.");
        }
        if (studentId === "all") {
            const students = await User_1.User.find({ role: "student" });
            if (students.length === 0) {
                throw new errors_1.BadRequestError("No students found to assign to.");
            }
            const newAssignments = students.map((s) => ({
                title,
                subject,
                dueDate,
                maxMarks: Number(maxMarks),
                description,
                studentId: s.id,
                status: "pending",
                marks: null,
            }));
            const inserted = await Assignment_1.Assignment.insertMany(newAssignments);
            return { message: `Assignment posted to all ${students.length} students successfully.`, assignments: inserted };
        }
        const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
        const targetSem = normalizeSemester(studentId);
        if (semesters.includes(targetSem)) {
            const students = await User_1.User.find({ role: "student" });
            const matchedStudents = students.filter((s) => s.semester && normalizeSemester(s.semester) === targetSem);
            if (matchedStudents.length === 0) {
                throw new errors_1.BadRequestError(`No students found in ${studentId} semester.`);
            }
            const newAssignments = matchedStudents.map((s) => ({
                title,
                subject,
                dueDate,
                maxMarks: Number(maxMarks),
                description,
                studentId: s.id,
                status: "pending",
                marks: null,
            }));
            const inserted = await Assignment_1.Assignment.insertMany(newAssignments);
            return {
                message: `Assignment posted to all ${matchedStudents.length} students in ${studentId} Semester successfully.`,
                assignments: inserted,
            };
        }
        else {
            const student = await User_1.User.findOne({ id: studentId, role: "student" });
            if (!student) {
                throw new errors_1.NotFoundError(`Student or Semester matching "${studentId}" not found.`);
            }
            const newAssignment = new Assignment_1.Assignment({
                title,
                subject,
                dueDate,
                maxMarks: Number(maxMarks),
                description,
                studentId: studentId,
                status: "pending",
                marks: null,
            });
            await newAssignment.save();
            return { message: `Assignment posted to student ${student.name} successfully.`, assignment: newAssignment };
        }
    }
    /**
     * Delete an assignment
     */
    static async deleteAssignment(id) {
        const deleted = await Assignment_1.Assignment.findByIdAndDelete(id);
        if (!deleted) {
            throw new errors_1.NotFoundError("Assignment not found.");
        }
        return deleted;
    }
    /**
     * Grade an assignment submission
     */
    static async gradeAssignment(id, marks) {
        const assignment = await Assignment_1.Assignment.findById(id);
        if (!assignment) {
            throw new errors_1.NotFoundError("Assignment not found.");
        }
        if (assignment.status !== "submitted" && assignment.status !== "graded") {
            throw new errors_1.BadRequestError("Assignment has not been submitted yet.");
        }
        if (marks < 0 || marks > assignment.maxMarks) {
            throw new errors_1.BadRequestError(`Marks must be between 0 and ${assignment.maxMarks}`);
        }
        assignment.status = "graded";
        assignment.marks = marks;
        await assignment.save();
        return assignment;
    }
    /**
     * Retrieve detailed subject-wise attendance for a student
     */
    static async getStudentAttendance(studentId) {
        return Attendance_1.Attendance.find({ studentId });
    }
    /**
     * Get all admin-configured subject details (total classes)
     */
    static async getSubjectDetails() {
        return SubjectDetails_1.SubjectDetails.find({}).sort({ department: 1, semester: 1, subject: 1 });
    }
    /**
     * Create or update subject details configuration
     */
    static async upsertSubjectDetails(data) {
        const { department, semester, subject, totalClasses } = data;
        if (!department || !semester || !subject || totalClasses === undefined) {
            throw new errors_1.BadRequestError("Department, semester, subject, and totalClasses are required.");
        }
        if (Number(totalClasses) < 0) {
            throw new errors_1.BadRequestError("Total classes cannot be negative.");
        }
        const doc = await SubjectDetails_1.SubjectDetails.findOneAndUpdate({ department, semester, subject }, { $set: { totalClasses: Number(totalClasses) } }, { upsert: true, new: true });
        return doc;
    }
    /**
     * Delete subject details configuration
     */
    static async deleteSubjectDetails(id) {
        const deleted = await SubjectDetails_1.SubjectDetails.findByIdAndDelete(id);
        if (!deleted) {
            throw new errors_1.NotFoundError("Subject details configuration not found.");
        }
        return deleted;
    }
    /**
     * Retrieve all administrators
     */
    static async getAdmins() {
        return User_1.User.find({ role: "admin" });
    }
    /**
     * Create a new admin account
     */
    static async createAdmin(data) {
        const { id, name, email, phone, password } = data;
        if (!id || !name || !email) {
            throw new errors_1.BadRequestError("ID, Name, and Email are required.");
        }
        if (phone && !/^\d{10}$/.test(phone)) {
            throw new errors_1.BadRequestError("Mobile number must be exactly 10 digits.");
        }
        const existingId = await User_1.User.findOne({ id });
        if (existingId) {
            throw new errors_1.BadRequestError("Admin ID already exists.");
        }
        const existingEmail = await User_1.User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            throw new errors_1.BadRequestError("Email is already registered.");
        }
        const pass = password || "demo123";
        const passwordHash = await bcryptjs_1.default.hash(pass, 10);
        const newAdmin = new User_1.User({
            id,
            name,
            email: email.toLowerCase(),
            phone,
            role: "admin",
            passwordHash,
            joinDate: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long"
            }),
            profileCompleted: true
        });
        await newAdmin.save();
        return newAdmin;
    }
    /**
     * Update admin account details
     */
    static async updateAdmin(id, data) {
        const { name, email, phone } = data;
        if (phone && !/^\d{10}$/.test(phone)) {
            throw new errors_1.BadRequestError("Mobile number must be exactly 10 digits.");
        }
        const admin = await User_1.User.findOneAndUpdate({ id, role: "admin" }, { $set: { name, email: email?.toLowerCase(), phone } }, { new: true });
        if (!admin) {
            throw new errors_1.NotFoundError("Admin not found.");
        }
        return admin;
    }
    /**
     * Delete an admin account
     */
    static async deleteAdmin(currentAdminId, idToDelete) {
        if (currentAdminId === idToDelete) {
            throw new errors_1.BadRequestError("You cannot delete your own admin account.");
        }
        const deleted = await User_1.User.findOneAndDelete({ id: idToDelete, role: "admin" });
        if (!deleted) {
            throw new errors_1.NotFoundError("Admin account not found.");
        }
        return deleted;
    }
}
exports.AdminService = AdminService;
