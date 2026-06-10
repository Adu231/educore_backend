import mongoose from "mongoose";
import { env } from "./config/env";
import { User } from "./models/User";
import { Attendance } from "./models/Attendance";
import { AttendanceTrend } from "./models/AttendanceTrend";
import { Assignment } from "./models/Assignment";
import { Timetable } from "./models/Timetable";
import { Notice } from "./models/Notice";
import { BlogPost } from "./models/BlogPost";
import { Result } from "./models/Result";
import { Faculty } from "./models/Faculty";
import { SubjectDetails } from "./models/SubjectDetails";
import { ContactMessage } from "./models/ContactMessage";
import { Newsletter } from "./models/Newsletter";
import { Transaction } from "./models/Transaction";

const wipeDatabase = async () => {
  try {
    console.log("Connecting to database: " + env.MONGODB_URI);
    await mongoose.connect(env.MONGODB_URI);
    console.log("Successfully connected! Wiping all collections...");

    // Delete all documents in all collections
    const deleteOps = [
      User.deleteMany({}),
      Attendance.deleteMany({}),
      AttendanceTrend.deleteMany({}),
      Assignment.deleteMany({}),
      Timetable.deleteMany({}),
      Notice.deleteMany({}),
      BlogPost.deleteMany({}),
      Result.deleteMany({}),
      Faculty.deleteMany({}),
      SubjectDetails.deleteMany({}),
      ContactMessage.deleteMany({}),
      Newsletter.deleteMany({}),
      Transaction.deleteMany({})
    ];

    await Promise.all(deleteOps);
    console.log("All collections wiped completely clean!");

    console.log("Closing connection...");
    await mongoose.connection.close();
    console.log("Database connection closed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Database wipe failed:", err);
    process.exit(1);
  }
};

wipeDatabase();
