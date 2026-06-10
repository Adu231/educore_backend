import { Attendance } from "../models/Attendance";
import { AttendanceTrend } from "../models/AttendanceTrend";
import { Assignment } from "../models/Assignment";
import { Result } from "../models/Result";
import { Timetable } from "../models/Timetable";
import { User } from "../models/User";
import { SubjectDetails } from "../models/SubjectDetails";
import { NotFoundError, BadRequestError } from "../utils/errors";

const normalizeSemester = (sem: string): string => {
  const match = sem.match(/(\d+)/);
  if (!match) return sem;
  const num = match[1];
  let suffix = "th";
  if (num === "1") suffix = "st";
  else if (num === "2") suffix = "nd";
  else if (num === "3") suffix = "rd";
  return `${num}${suffix}`;
};

export class StudentService {
  /**
   * Get student attendance records
   */
  static async getAttendance(studentId: string) {
    return Attendance.find({ studentId });
  }

  /**
   * Get monthly attendance trends
   */
  static async getAttendanceTrend(studentId: string) {
    return AttendanceTrend.find({ studentId }).sort({ createdAt: 1 });
  }

  /**
   * Get student assignments
   */
  static async getAssignments(studentId: string) {
    return Assignment.find({ studentId });
  }

  /**
   * Submit an assignment
   */
  static async submitAssignment(studentId: string, assignmentId: string, fileUrl: string, notes?: string) {
    if (!fileUrl) {
      throw new BadRequestError("File URL is required.");
    }

    const assignment = await Assignment.findOne({ _id: assignmentId, studentId });
    if (!assignment) {
      throw new NotFoundError("Assignment not found.");
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
  static async getResults(studentId: string) {
    return Result.find({ studentId }).sort({ semester: 1 });
  }

  /**
   * Get student's semester-specific timetable
   */
  static async getTimetable(studentId: string) {
    const student = await User.findOne({ id: studentId });
    if (!student) {
      throw new NotFoundError("Student profile not found.");
    }
    const normSem = normalizeSemester(student.semester || "Pending");
    return Timetable.find({ semester: normSem });
  }

  /**
   * Add or update subject-wise attendance for a student
   */
  static async addOrUpdateAttendance(studentId: string, subject: string, attended: number, customTotal?: number) {
    if (!subject) {
      throw new BadRequestError("Subject name is required.");
    }
    if (attended === undefined || attended === null) {
      throw new BadRequestError("Attended classes count is required.");
    }
    if (attended < 0) {
      throw new BadRequestError("Attended classes count must be non-negative.");
    }

    const student = await User.findOne({ id: studentId });
    if (!student) {
      throw new NotFoundError("Student profile not found.");
    }

    const dept = student.department || "General";
    const sem = student.semester || "Pending";
    const normSem = normalizeSemester(sem);

    let total: number;
    const config = await SubjectDetails.findOne({ department: dept, semester: normSem, subject });
    if (!config) {
      if (customTotal !== undefined && customTotal !== null) {
        total = customTotal;
      } else {
        throw new BadRequestError(`Subject "${subject}" is not configured by the admin for department "${dept}" and semester "${sem}".`);
      }
    } else {
      total = config.totalClasses;
    }

    if (attended > total) {
      throw new BadRequestError(`Attended classes (${attended}) cannot exceed total classes held (${total}).`);
    }

    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

    let record = await Attendance.findOne({ studentId, subject });
    if (record) {
      record.total = total;
      record.attended = attended;
      record.percentage = percentage;
      await record.save();
    } else {
      record = new Attendance({
        studentId,
        subject,
        total,
        attended,
        percentage
      });
      await record.save();
    }

    // Recalculate overall average attendance percentage
    const allRecords = await Attendance.find({ studentId });
    const overallPercentage = allRecords.length > 0
      ? Math.round(allRecords.reduce((sum, r) => sum + (r.percentage || 0), 0) / allRecords.length)
      : 100;

    // Update user profile record
    await User.findOneAndUpdate({ id: studentId }, { $set: { attendance: overallPercentage } });

    // Update AttendanceTrend for the current month
    const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
    await AttendanceTrend.findOneAndUpdate(
      { studentId, month: currentMonth },
      { $set: { attendance: overallPercentage } },
      { upsert: true, new: true }
    );

    return record;
  }

  /**
   * Get configured subjects details for a student's department and semester
   */
  static async getSubjectDetails(department: string, semester: string) {
    return SubjectDetails.find({ department, semester }).sort({ subject: 1 });
  }

  /**
   * Get configured subjects details scoped by studentId
   */
  static async getSubjectDetailsByStudentId(studentId: string) {
    const student = await User.findOne({ id: studentId });
    if (!student) {
      throw new NotFoundError("Student profile not found.");
    }
    const normSem = normalizeSemester(student.semester || "Pending");
    return this.getSubjectDetails(student.department || "General", normSem);
  }
}
