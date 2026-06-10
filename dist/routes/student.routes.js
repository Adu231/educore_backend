"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controllers/student.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply student authorization guards to all student routes
router.use(auth_middleware_1.authMiddleware);
router.use((0, auth_middleware_1.roleGuard)(["student"]));
router.get("/attendance", student_controller_1.StudentController.getAttendance);
router.post("/attendance", student_controller_1.StudentController.addOrUpdateAttendance);
router.get("/subject-details", student_controller_1.StudentController.getSubjectDetails);
router.get("/attendance/trend", student_controller_1.StudentController.getAttendanceTrend);
router.get("/assignments", student_controller_1.StudentController.getAssignments);
router.post("/assignments/:id/submit", student_controller_1.StudentController.submitAssignment);
router.get("/results/:id", student_controller_1.StudentController.getResults);
router.get("/timetable", student_controller_1.StudentController.getTimetable);
exports.default = router;
