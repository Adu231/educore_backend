import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { StudentService } from "../services/student.service";
import { ResponseHandler } from "../utils/response";
import { BadRequestError } from "../utils/errors";

export class StudentController {
  /**
   * Get student's attendance records
   */
  static async getAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        throw new BadRequestError("Student authentication context missing.");
      }
      const records = await StudentService.getAttendance(studentId);
      return ResponseHandler.success(res, records);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student's attendance monthly trends
   */
  static async getAttendanceTrend(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        throw new BadRequestError("Student authentication context missing.");
      }
      const trends = await StudentService.getAttendanceTrend(studentId);
      return ResponseHandler.success(res, trends);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student's assignments
   */
  static async getAssignments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        throw new BadRequestError("Student authentication context missing.");
      }
      const assignments = await StudentService.getAssignments(studentId);
      return ResponseHandler.success(res, assignments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Submit an assignment
   */
  static async submitAssignment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        throw new BadRequestError("Student authentication context missing.");
      }
      const { id } = req.params;
      const { fileUrl, notes } = req.body;
      const result = await StudentService.submitAssignment(studentId, id, fileUrl, notes);
      return ResponseHandler.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student's academic results
   */
  static async getResults(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Student ID parameter is missing.");
      }
      const results = await StudentService.getResults(id);
      return ResponseHandler.success(res, results);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get department classes timetables
   */
  static async getTimetable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        throw new BadRequestError("Student authentication context missing.");
      }
      const timetable = await StudentService.getTimetable(studentId);
      return ResponseHandler.success(res, timetable);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add or update student attendance record subject-wise
   */
  static async addOrUpdateAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        throw new BadRequestError("Student authentication context missing.");
      }
      const { subject, attended, totalClasses } = req.body;
      const result = await StudentService.addOrUpdateAttendance(
        studentId,
        subject,
        Number(attended),
        totalClasses !== undefined ? Number(totalClasses) : undefined
      );
      return ResponseHandler.success(res, { message: "Subject attendance updated successfully.", record: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get configured subjects details for student department/semester
   */
  static async getSubjectDetails(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        throw new BadRequestError("Student authentication context missing.");
      }
      const details = await StudentService.getSubjectDetailsByStudentId(studentId);
      return ResponseHandler.success(res, details);
    } catch (error) {
      next(error);
    }
  }
}
