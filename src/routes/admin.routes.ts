import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware, roleGuard } from "../middleware/auth.middleware";

const router = Router();

// Apply authentication to all routes
router.use(authMiddleware);

// Get Notices is accessible by both admin and student
router.get("/notices", roleGuard(["admin", "student"]), AdminController.getNotices);

// Apply admin security guard to all subsequent routes
router.use(roleGuard(["admin"]));


// Dashboard Metrics
router.get("/metrics", AdminController.getMetrics);

// Student Management
router.get("/students", AdminController.getStudents);
router.post("/students", AdminController.createStudent);
router.put("/students/:id", AdminController.updateStudent);
router.delete("/students/:id", AdminController.deleteStudent);

// Admin Account Management
router.get("/admins", AdminController.getAdmins);
router.post("/admins", AdminController.createAdmin);
router.put("/admins/:id", AdminController.updateAdmin);
router.delete("/admins/:id", AdminController.deleteAdmin);

// Faculty Management
router.get("/faculty", AdminController.getFaculty);
router.post("/faculty", AdminController.createFaculty);
router.put("/faculty/:id", AdminController.updateFaculty);
router.delete("/faculty/:id", AdminController.deleteFaculty);

// Notices Board
router.post("/notices", AdminController.createNotice);
router.put("/notices/:id", AdminController.updateNotice);
router.delete("/notices/:id", AdminController.deleteNotice);
router.patch("/notices/:id/publish", AdminController.toggleNoticePublish);

// Timetable Configuration
router.get("/timetable", AdminController.getTimetables);
router.post("/timetable", AdminController.createTimetable);
router.put("/timetable/:day/:index", AdminController.updateTimetableSlot);
router.delete("/timetable/:day/:index", AdminController.deleteTimetableSlot);

// Result & Grade Management
router.get("/results", AdminController.getAllResults);
router.get("/students/:id/results", AdminController.getStudentResults);
router.post("/students/:id/results", AdminController.publishResult);
router.delete("/students/:id/results/:semester", AdminController.deleteResult);
router.put("/students/:id/results/:semester/gpa", AdminController.updateResultGpa);

// Result Subject Item Actions
router.post("/students/:id/results/:semester/subjects", AdminController.addSubjectToResult);
router.put("/students/:id/results/:semester/subjects/:index", AdminController.updateSubjectInResult);
router.delete("/students/:id/results/:semester/subjects/:index", AdminController.deleteSubjectFromResult);

// Analytics
router.get("/analytics/enrollment-growth", AdminController.getEnrollmentGrowth);

// Assignments Management
router.get("/assignments", AdminController.getAssignments);
router.post("/assignments", AdminController.createAssignment);
router.delete("/assignments/:id", AdminController.deleteAssignment);
router.put("/assignments/:id/grade", AdminController.gradeAssignment);

// Student Detailed Attendance
router.get("/students/:id/attendance", AdminController.getStudentAttendance);

// Subject Details Configuration
router.get("/subject-details", AdminController.getSubjectDetails);
router.post("/subject-details", AdminController.upsertSubjectDetails);
router.delete("/subject-details/:id", AdminController.deleteSubjectDetails);

export default router;
