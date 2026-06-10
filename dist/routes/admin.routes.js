"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply authentication to all routes
router.use(auth_middleware_1.authMiddleware);
// Get Notices is accessible by both admin and student
router.get("/notices", (0, auth_middleware_1.roleGuard)(["admin", "student"]), admin_controller_1.AdminController.getNotices);
// Apply admin security guard to all subsequent routes
router.use((0, auth_middleware_1.roleGuard)(["admin"]));
// Dashboard Metrics
router.get("/metrics", admin_controller_1.AdminController.getMetrics);
// Student Management
router.get("/students", admin_controller_1.AdminController.getStudents);
router.post("/students", admin_controller_1.AdminController.createStudent);
router.put("/students/:id", admin_controller_1.AdminController.updateStudent);
router.delete("/students/:id", admin_controller_1.AdminController.deleteStudent);
// Admin Account Management
router.get("/admins", admin_controller_1.AdminController.getAdmins);
router.post("/admins", admin_controller_1.AdminController.createAdmin);
router.put("/admins/:id", admin_controller_1.AdminController.updateAdmin);
router.delete("/admins/:id", admin_controller_1.AdminController.deleteAdmin);
// Faculty Management
router.get("/faculty", admin_controller_1.AdminController.getFaculty);
router.post("/faculty", admin_controller_1.AdminController.createFaculty);
router.put("/faculty/:id", admin_controller_1.AdminController.updateFaculty);
router.delete("/faculty/:id", admin_controller_1.AdminController.deleteFaculty);
// Notices Board
router.post("/notices", admin_controller_1.AdminController.createNotice);
router.put("/notices/:id", admin_controller_1.AdminController.updateNotice);
router.delete("/notices/:id", admin_controller_1.AdminController.deleteNotice);
router.patch("/notices/:id/publish", admin_controller_1.AdminController.toggleNoticePublish);
// Timetable Configuration
router.get("/timetable", admin_controller_1.AdminController.getTimetables);
router.post("/timetable", admin_controller_1.AdminController.createTimetable);
router.put("/timetable/:day/:index", admin_controller_1.AdminController.updateTimetableSlot);
router.delete("/timetable/:day/:index", admin_controller_1.AdminController.deleteTimetableSlot);
// Result & Grade Management
router.get("/results", admin_controller_1.AdminController.getAllResults);
router.get("/students/:id/results", admin_controller_1.AdminController.getStudentResults);
router.post("/students/:id/results", admin_controller_1.AdminController.publishResult);
router.delete("/students/:id/results/:semester", admin_controller_1.AdminController.deleteResult);
router.put("/students/:id/results/:semester/gpa", admin_controller_1.AdminController.updateResultGpa);
// Result Subject Item Actions
router.post("/students/:id/results/:semester/subjects", admin_controller_1.AdminController.addSubjectToResult);
router.put("/students/:id/results/:semester/subjects/:index", admin_controller_1.AdminController.updateSubjectInResult);
router.delete("/students/:id/results/:semester/subjects/:index", admin_controller_1.AdminController.deleteSubjectFromResult);
// Analytics
router.get("/analytics/enrollment-growth", admin_controller_1.AdminController.getEnrollmentGrowth);
// Assignments Management
router.get("/assignments", admin_controller_1.AdminController.getAssignments);
router.post("/assignments", admin_controller_1.AdminController.createAssignment);
router.delete("/assignments/:id", admin_controller_1.AdminController.deleteAssignment);
router.put("/assignments/:id/grade", admin_controller_1.AdminController.gradeAssignment);
// Student Detailed Attendance
router.get("/students/:id/attendance", admin_controller_1.AdminController.getStudentAttendance);
// Subject Details Configuration
router.get("/subject-details", admin_controller_1.AdminController.getSubjectDetails);
router.post("/subject-details", admin_controller_1.AdminController.upsertSubjectDetails);
router.delete("/subject-details/:id", admin_controller_1.AdminController.deleteSubjectDetails);
exports.default = router;
