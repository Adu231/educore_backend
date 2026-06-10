import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";
import { ResponseHandler } from "../utils/response";

export class AdminController {
  /**
   * Get main metrics
   */
  static async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await AdminService.getMetrics();
      return ResponseHandler.success(res, metrics);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all students directory
   */
  static async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await AdminService.getStudents();
      return ResponseHandler.success(res, students);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add a new student record
   */
  static async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await AdminService.createStudent(req.body);
      return ResponseHandler.success(
        res,
        { message: "Student record created successfully.", student },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit student record details
   */
  static async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const student = await AdminService.updateStudent(id, req.body);
      return ResponseHandler.success(
        res,
        { message: "Student record updated successfully.", student }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete student record
   */
  static async deleteStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminService.deleteStudent(id);
      return ResponseHandler.success(res, { message: "Student record deleted successfully." });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get notice board announcements
   */
  static async getNotices(req: Request, res: Response, next: NextFunction) {
    try {
      const notices = await AdminService.getNotices();
      return ResponseHandler.success(res, notices);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish notice bulletin
   */
  static async createNotice(req: Request, res: Response, next: NextFunction) {
    try {
      const notice = await AdminService.createNotice(req.body);
      return ResponseHandler.success(
        res,
        { message: "Notice bulletin published successfully.", notice },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update notice details
   */
  static async updateNotice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const notice = await AdminService.updateNotice(id, req.body);
      return ResponseHandler.success(
        res,
        { message: "Notice updated successfully.", notice }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a notice
   */
  static async deleteNotice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminService.deleteNotice(id);
      return ResponseHandler.success(res, { message: "Notice deleted successfully." });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle notice publish flag
   */
  static async toggleNoticePublish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { published } = req.body;
      const notice = await AdminService.toggleNoticePublish(id, published);
      return ResponseHandler.success(
        res,
        { message: `Notice ${published ? "published" : "drafted"} successfully.`, notice }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get timetable layouts
   */
  static async getTimetables(req: Request, res: Response, next: NextFunction) {
    try {
      const { semester } = req.query;
      const schedules = await AdminService.getTimetables(semester as string);
      return ResponseHandler.success(res, schedules);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new timetable layout day
   */
  static async createTimetable(req: Request, res: Response, next: NextFunction) {
    try {
      const timetable = await AdminService.createTimetable(req.body);
      return ResponseHandler.success(
        res,
        { message: "Timetable created successfully.", timetable },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update timetable schedule slots
   */
  static async updateTimetableSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { day, index } = req.params;
      const { semester } = req.query;
      const timetable = await AdminService.updateTimetableSlot(day, index, req.body, semester as string);
      return ResponseHandler.success(
        res,
        { message: "Timetable schedule slot updated successfully.", timetable }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a timetable slot
   */
  static async deleteTimetableSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { day, index } = req.params;
      const { semester } = req.query;
      const timetable = await AdminService.deleteTimetableSlot(day, index, semester as string);
      return ResponseHandler.success(
        res,
        { message: "Timetable slot deleted successfully.", timetable }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all student academic results
   */
  static async getAllResults(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await AdminService.getAllResults();
      return ResponseHandler.success(res, results);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get results for student
   */
  static async getStudentResults(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const results = await AdminService.getStudentResults(id);
      return ResponseHandler.success(res, results);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish results for student semester
   */
  static async publishResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await AdminService.publishResult(id, req.body);
      return ResponseHandler.success(
        res,
        { message: "Semester results successfully published.", result },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete student result semester record
   */
  static async deleteResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, semester } = req.params;
      await AdminService.deleteResult(id, semester);
      return ResponseHandler.success(res, { message: "Semester record deleted successfully." });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update semester result GPAs
   */
  static async updateResultGpa(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, semester } = req.params;
      const { sgpa, cgpa } = req.body;
      const result = await AdminService.updateResultGpa(id, semester, sgpa, cgpa);
      return ResponseHandler.success(
        res,
        { message: "GPAs updated successfully.", result }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add subject slot to result
   */
  static async addSubjectToResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, semester } = req.params;
      const result = await AdminService.addSubjectToResult(id, semester, req.body);
      return ResponseHandler.success(
        res,
        { message: "Subject record added successfully.", result }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update subject slot details in result
   */
  static async updateSubjectInResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, semester, index } = req.params;
      const result = await AdminService.updateSubjectInResult(id, semester, index, req.body);
      return ResponseHandler.success(
        res,
        { message: "Subject record updated successfully.", result }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove subject slot from result
   */
  static async deleteSubjectFromResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, semester, index } = req.params;
      const result = await AdminService.deleteSubjectFromResult(id, semester, index);
      return ResponseHandler.success(
        res,
        { message: "Subject record deleted successfully.", result }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get enrollment graph analytics data
   */
  static async getEnrollmentGrowth(req: Request, res: Response, next: NextFunction) {
    try {
      const growth = await AdminService.getEnrollmentGrowth();
      return ResponseHandler.success(res, growth);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all faculty records
   */
  static async getFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const facultyList = await AdminService.getFaculty();
      return ResponseHandler.success(res, facultyList);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new faculty member record
   */
  static async createFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const faculty = await AdminService.createFaculty(req.body);
      return ResponseHandler.success(
        res,
        { message: "Faculty record created successfully.", faculty },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update details of an existing faculty member
   */
  static async updateFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const faculty = await AdminService.updateFaculty(id, req.body);
      return ResponseHandler.success(
        res,
        { message: "Faculty record updated successfully.", faculty }
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a faculty member record
   */
  static async deleteFaculty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminService.deleteFaculty(id);
      return ResponseHandler.success(res, { message: "Faculty record deleted successfully." });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve all assignments
   */
  static async getAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const assignments = await AdminService.getAssignments();
      return ResponseHandler.success(res, assignments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new assignments
   */
  static async createAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.createAssignment(req.body);
      return ResponseHandler.success(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an assignment
   */
  static async deleteAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await AdminService.deleteAssignment(id);
      return ResponseHandler.success(res, { message: "Assignment deleted successfully.", assignment: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Grade a student's assignment submission
   */
  static async gradeAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { marks } = req.body;
      const result = await AdminService.gradeAssignment(id, Number(marks));
      return ResponseHandler.success(res, { message: "Assignment graded successfully.", assignment: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get detailed subject-wise attendance for a student
   */
  static async getStudentAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const attendance = await AdminService.getStudentAttendance(id);
      return ResponseHandler.success(res, attendance);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all admin-configured subject details
   */
  static async getSubjectDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const details = await AdminService.getSubjectDetails();
      return ResponseHandler.success(res, details);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create or update subject configuration
   */
  static async upsertSubjectDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.upsertSubjectDetails(req.body);
      return ResponseHandler.success(res, { message: "Subject details updated successfully.", data: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete subject configuration
   */
  static async deleteSubjectDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminService.deleteSubjectDetails(id);
      return ResponseHandler.success(res, { message: "Subject configuration deleted successfully." });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve all administrators
   */
  static async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await AdminService.getAdmins();
      return ResponseHandler.success(res, admins);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new administrator account
   */
  static async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await AdminService.createAdmin(req.body);
      return ResponseHandler.success(res, { message: "Administrator account created successfully.", admin }, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an administrator account
   */
  static async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const admin = await AdminService.updateAdmin(id, req.body);
      return ResponseHandler.success(res, { message: "Administrator account updated successfully.", admin });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an administrator account
   */
  static async deleteAdmin(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const currentAdminId = req.user?.id;
      await AdminService.deleteAdmin(currentAdminId, id);
      return ResponseHandler.success(res, { message: "Administrator account deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
}
