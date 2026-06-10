import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { authMiddleware, roleGuard } from "../middleware/auth.middleware";

const router = Router();

// Apply student authorization guards to all student routes
router.use(authMiddleware);
router.use(roleGuard(["student"]));

router.get("/attendance", StudentController.getAttendance);
router.post("/attendance", StudentController.addOrUpdateAttendance);
router.get("/subject-details", StudentController.getSubjectDetails);
router.get("/attendance/trend", StudentController.getAttendanceTrend);
router.get("/assignments", StudentController.getAssignments);
router.post("/assignments/:id/submit", StudentController.submitAssignment);
router.get("/results/:id", StudentController.getResults);
router.get("/timetable", StudentController.getTimetable);

export default router;
