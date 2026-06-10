import mongoose from "mongoose";
import { User } from "./models/User";
import { Notice } from "./models/Notice";
import { Result } from "./models/Result";
import { Timetable } from "./models/Timetable";
import { Faculty } from "./models/Faculty";
import { Assignment } from "./models/Assignment";
import { Attendance } from "./models/Attendance";
import { AttendanceTrend } from "./models/AttendanceTrend";
import { SubjectDetails } from "./models/SubjectDetails";
import { env } from "./config/env";

async function run() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to db successfully.");

  const collections = [
    { name: "User", model: User },
    { name: "Notice", model: Notice },
    { name: "Result", model: Result },
    { name: "Timetable", model: Timetable },
    { name: "Faculty", model: Faculty },
    { name: "Assignment", model: Assignment },
    { name: "Attendance", model: Attendance },
    { name: "AttendanceTrend", model: AttendanceTrend },
    { name: "SubjectDetails", model: SubjectDetails },
  ];

  for (const col of collections) {
    const count = await col.model.countDocuments({});
    console.log(`Collection: ${col.name}, Document Count: ${count}`);
    
    try {
      const docs = await (col.model as any).find({});
      for (const doc of docs) {
        const err = (doc as any).validateSync?.();
        if (err) {
          console.error(`Validation error in ${col.name} document ID ${doc._id || (doc as any).id}:`, err.message);
        }
      }
    } catch (err: any) {
      console.error(`Error validating collection ${col.name}:`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log("Disconnected from db.");
}

run().catch(console.error);
