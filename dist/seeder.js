"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("./config/env");
const User_1 = require("./models/User");
const Attendance_1 = require("./models/Attendance");
const AttendanceTrend_1 = require("./models/AttendanceTrend");
const Assignment_1 = require("./models/Assignment");
const Timetable_1 = require("./models/Timetable");
const Notice_1 = require("./models/Notice");
const BlogPost_1 = require("./models/BlogPost");
const Result_1 = require("./models/Result");
const Faculty_1 = require("./models/Faculty");
const seedData = async () => {
    try {
        console.log("Connecting to database: " + env_1.env.MONGODB_URI);
        await mongoose_1.default.connect(env_1.env.MONGODB_URI);
        console.log("Successfully connected! Clearing database...");
        // Clear existing collections
        await User_1.User.deleteMany({});
        await Attendance_1.Attendance.deleteMany({});
        await AttendanceTrend_1.AttendanceTrend.deleteMany({});
        await Assignment_1.Assignment.deleteMany({});
        await Timetable_1.Timetable.deleteMany({});
        await Notice_1.Notice.deleteMany({});
        await BlogPost_1.BlogPost.deleteMany({});
        await Result_1.Result.deleteMany({});
        await Faculty_1.Faculty.deleteMany({});
        console.log("Collections cleared. Seeding data...");
        // 1. Hash default passwords
        const passwordHash = await bcryptjs_1.default.hash("demo123", 10);
        // 2. Seed Users (Students and Admins)
        const users = [
            {
                id: "CS2021001",
                name: "Alex Johnson",
                email: "student@educore.com",
                passwordHash,
                role: "student",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                rollNumber: "CS2021001",
                department: "Computer Science",
                semester: "6th",
                phone: "+1 (555) 123-4567",
                address: "123 Campus Drive, University City",
                joinDate: "August 2021",
                attendance: 93,
                cgpa: 8.8,
                status: "active",
                profileCompleted: true
            },
            {
                id: "a001",
                name: "Dr. Sarah Mitchell",
                email: "admin@educore.com",
                passwordHash,
                role: "admin",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
                department: "Administration",
                phone: "+1 (555) 987-6543",
                address: "Admin Block, Room 101",
                joinDate: "January 2018",
                status: "active",
                profileCompleted: true
            },
            { id: "CS2021002", name: "Emily Davis", email: "emily@student.edu", passwordHash, role: "student", department: "Computer Science", semester: "6th", attendance: 88, cgpa: 9.1, status: "active", profileCompleted: true },
            { id: "EC2021003", name: "Michael Chen", email: "michael@student.edu", passwordHash, role: "student", department: "Electronics", semester: "6th", attendance: 75, cgpa: 7.8, status: "warning", profileCompleted: true },
            { id: "ME2021004", name: "Sarah Wilson", email: "sarah@student.edu", passwordHash, role: "student", department: "Mechanical", semester: "6th", attendance: 91, cgpa: 8.5, status: "active", profileCompleted: true },
            { id: "CS2021005", name: "David Brown", email: "david@student.edu", passwordHash, role: "student", department: "Computer Science", semester: "6th", attendance: 65, cgpa: 6.9, status: "at-risk", profileCompleted: true },
            { id: "CE2021006", name: "Jessica Lee", email: "jessica@student.edu", passwordHash, role: "student", department: "Civil Engg", semester: "6th", attendance: 96, cgpa: 9.4, status: "active", profileCompleted: true },
            { id: "CS2021007", name: "Ryan Martinez", email: "ryan@student.edu", passwordHash, role: "student", department: "Computer Science", semester: "4th", attendance: 82, cgpa: 8.0, status: "active", profileCompleted: true },
            { id: "EC2021008", name: "Aisha Patel", email: "aisha@student.edu", passwordHash, role: "student", department: "Electronics", semester: "4th", attendance: 90, cgpa: 8.7, status: "active", profileCompleted: true }
        ];
        await User_1.User.insertMany(users);
        console.log("Users seeded successfully!");
        // 3. Seed Attendance for Student Alex Johnson (CS2021001)
        const attendances = [
            { studentId: "CS2021001", subject: "Data Structures", total: 45, attended: 42, percentage: 93 },
            { studentId: "CS2021001", subject: "Operating Systems", total: 40, attended: 35, percentage: 87 },
            { studentId: "CS2021001", subject: "Database Management", total: 38, attended: 30, percentage: 79 },
            { studentId: "CS2021001", subject: "Computer Networks", total: 42, attended: 40, percentage: 95 },
            { studentId: "CS2021001", subject: "Software Engineering", total: 36, attended: 28, percentage: 78 },
            { studentId: "CS2021001", subject: "Machine Learning", total: 30, attended: 27, percentage: 90 }
        ];
        await Attendance_1.Attendance.insertMany(attendances);
        // 4. Seed Attendance trend for Student Alex Johnson (CS2021001)
        const trends = [
            { studentId: "CS2021001", month: "Jan", attendance: 88 },
            { studentId: "CS2021001", month: "Feb", attendance: 92 },
            { studentId: "CS2021001", month: "Mar", attendance: 85 },
            { studentId: "CS2021001", month: "Apr", attendance: 91 },
            { studentId: "CS2021001", month: "May", attendance: 87 },
            { studentId: "CS2021001", month: "Jun", attendance: 94 }
        ];
        await AttendanceTrend_1.AttendanceTrend.insertMany(trends);
        console.log("Attendance and trends seeded successfully!");
        // 5. Seed Assignments for student CS2021001
        const assignments = [
            {
                title: "Binary Search Tree Implementation",
                subject: "Data Structures",
                dueDate: "2024-06-15",
                status: "pending",
                marks: null,
                maxMarks: 20,
                description: "Implement BST with insert, delete, and search operations in C++.",
                studentId: "CS2021001"
            },
            {
                title: "Process Scheduling Simulation",
                subject: "Operating Systems",
                dueDate: "2024-06-10",
                status: "submitted",
                marks: 18,
                maxMarks: 20,
                description: "Simulate FCFS, SJF, and Round Robin scheduling algorithms.",
                studentId: "CS2021001",
                submission: {
                    fileUrl: "https://educore-storage.s3.amazonaws.com/submissions/s001-a2.zip",
                    notes: "Implemented scheduling algorithms in C++.",
                    submittedAt: new Date("2026-06-03T16:42:27Z")
                }
            },
            {
                title: "ER Diagram for E-commerce",
                subject: "Database Management",
                dueDate: "2024-06-05",
                status: "graded",
                marks: 17,
                maxMarks: 20,
                description: "Design an entity-relationship diagram for an e-commerce platform.",
                studentId: "CS2021001",
                submission: {
                    fileUrl: "https://educore-storage.s3.amazonaws.com/submissions/s001-a3.pdf",
                    notes: "ER diagram is fully designed.",
                    submittedAt: new Date("2026-06-02T11:20:00Z")
                }
            }
        ];
        await Assignment_1.Assignment.insertMany(assignments);
        console.log("Assignments seeded successfully!");
        // 6. Seed Timetable schedules
        const schedules = [
            {
                day: "Monday",
                roleScope: "all",
                semester: "6th",
                slots: [
                    { time: "9:00 - 10:00", subject: "Data Structures", room: "CS-101", faculty: "Prof. Williams" },
                    { time: "10:00 - 11:00", subject: "Operating Systems", room: "CS-102", faculty: "Prof. Davis" },
                    { time: "11:15 - 12:15", subject: "Database Management", room: "CS-103", faculty: "Prof. Chen" },
                    { time: "2:00 - 3:00", subject: "Lab - Programming", room: "Lab-A", faculty: "Prof. Brown" }
                ]
            },
            {
                day: "Tuesday",
                roleScope: "all",
                semester: "6th",
                slots: [
                    { time: "9:00 - 10:00", subject: "Computer Networks", room: "CS-104", faculty: "Prof. Garcia" },
                    { time: "10:00 - 11:00", subject: "Machine Learning", room: "CS-201", faculty: "Prof. Smith" },
                    { time: "11:15 - 12:15", subject: "Software Engineering", room: "CS-102", faculty: "Prof. Lee" }
                ]
            },
            {
                day: "Wednesday",
                roleScope: "all",
                semester: "6th",
                slots: [
                    { time: "9:00 - 10:00", subject: "Data Structures", room: "CS-101", faculty: "Prof. Williams" },
                    { time: "10:00 - 12:00", subject: "Lab - Database", room: "Lab-B", faculty: "Prof. Chen" },
                    { time: "2:00 - 3:00", subject: "Operating Systems", room: "CS-102", faculty: "Prof. Davis" }
                ]
            },
            {
                day: "Thursday",
                roleScope: "all",
                semester: "6th",
                slots: [
                    { time: "9:00 - 10:00", subject: "Computer Networks", room: "CS-104", faculty: "Prof. Garcia" },
                    { time: "10:00 - 11:00", subject: "Machine Learning", room: "CS-201", faculty: "Prof. Smith" },
                    { time: "2:00 - 4:00", subject: "Lab - Networks", room: "Lab-C", faculty: "Prof. Garcia" }
                ]
            },
            {
                day: "Friday",
                roleScope: "all",
                semester: "6th",
                slots: [
                    { time: "9:00 - 10:00", subject: "Software Engineering", room: "CS-102", faculty: "Prof. Lee" },
                    { time: "10:00 - 11:00", subject: "Database Management", room: "CS-103", faculty: "Prof. Chen" },
                    { time: "11:15 - 12:15", subject: "Data Structures", room: "CS-101", faculty: "Prof. Williams" }
                ]
            }
        ];
        await Timetable_1.Timetable.insertMany(schedules);
        console.log("Timetable slots seeded successfully!");
        // 7. Seed Notice Board Announcements
        const notices = [
            { title: "End Semester Examination Schedule 2024", category: "Examination", date: "2024-06-01", priority: "high", content: "The end semester examinations for all programs will commence from July 1, 2024. Students are required to carry their hall tickets.", published: true },
            { title: "Holiday Notice - Independence Day", category: "Holiday", date: "2024-05-28", priority: "medium", content: "The college will remain closed on August 15, 2024 on account of Independence Day celebrations.", published: true },
            { title: "Fee Payment Deadline Reminder", category: "Finance", date: "2024-05-25", priority: "high", content: "This is a reminder that the last date for semester fee payment is July 15, 2024.", published: true },
            { title: "Annual Technical Fest Registration Open", category: "Event", date: "2024-05-20", priority: "medium", content: "Registrations for TechFest 2024 are now open. Students can register through the student portal.", published: true },
            { title: "Campus Placement Drive - TechCorp Inc.", category: "Placement", date: "2024-05-18", priority: "high", content: "TechCorp Inc. will be conducting placement interviews for final year students on June 25-26, 2024.", published: false }
        ];
        await Notice_1.Notice.insertMany(notices);
        console.log("Notices seeded successfully!");
        // 8. Seed Blog articles with detailed full prose paragraphs
        const blogs = [
            {
                id: "b1",
                title: "How AI is Transforming Modern Education",
                excerpt: "Artificial intelligence is revolutionizing how students learn and how educators teach, creating personalized learning experiences at scale.",
                content: [
                    "Artificial intelligence is no longer a future concept in classrooms. Today, smart algorithms are actively diagnosing students' strengths and customizing courses dynamically.",
                    "Furthermore, administrative systems utilize NLP to respond to basic student registration and campus queries instantly, enabling staff to prioritize direct counseling support.",
                    "As we look towards 2026, educational models will see deeper integrations of AI assistants aiding in complex coding evaluations, real-time translations, and interactive virtual laboratories."
                ],
                author: "Dr. Sarah Mitchell",
                date: "May 28, 2024",
                category: "Technology",
                readTime: "5 min read",
                image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop",
                featured: true
            },
            {
                id: "b2",
                title: "Best Practices for Student Engagement in 2024",
                excerpt: "Modern campuses are adopting new methods to keep students engaged, from gamification to collaborative digital platforms.",
                content: [
                    "Campus retention rates rely heavily on active engagement. The transition away from unidirectional lecturing to game-based quizzing and virtual forums has shown a 30% surge in participation.",
                    "Educators are using collaborative tools that allow real-time coding projects, document peer review, and group workshops inside the classroom."
                ],
                author: "Prof. James Williams",
                date: "May 20, 2024",
                category: "Education",
                readTime: "4 min read",
                image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
                featured: false
            }
        ];
        await BlogPost_1.BlogPost.insertMany(blogs);
        console.log("Blogs seeded successfully!");
        // 9. Seed Results for Alex Johnson (CS2021001)
        const results = [
            {
                studentId: "CS2021001",
                semester: "Semester 5",
                year: "2023-24",
                subjects: [
                    { name: "Data Structures", internal: 28, external: 62, total: 90, grade: "A+" },
                    { name: "Operating Systems", internal: 25, external: 58, total: 83, grade: "A" },
                    { name: "Database Management", internal: 27, external: 55, total: 82, grade: "A" },
                    { name: "Computer Networks", internal: 29, external: 61, total: 90, grade: "A+" },
                    { name: "Software Engineering", internal: 26, external: 56, total: 82, grade: "A" }
                ],
                sgpa: 9.2,
                cgpa: 8.8
            },
            {
                studentId: "CS2021001",
                semester: "Semester 4",
                year: "2022-23",
                subjects: [
                    { name: "Algorithms", internal: 26, external: 58, total: 84, grade: "A" },
                    { name: "Computer Architecture", internal: 24, external: 54, total: 78, grade: "B+" },
                    { name: "Discrete Mathematics", internal: 27, external: 60, total: 87, grade: "A" },
                    { name: "Web Technologies", internal: 29, external: 63, total: 92, grade: "A+" },
                    { name: "Object Oriented Programming", internal: 28, external: 60, total: 88, grade: "A+" }
                ],
                sgpa: 8.9,
                cgpa: 8.5
            }
        ];
        await Result_1.Result.insertMany(results);
        console.log("Results seeded successfully!");
        // 10. Seed Faculty
        const faculties = [
            {
                id: "F007",
                name: "Prof. David Lee",
                email: "lee@faculty.edu",
                phone: "+1 555-7007",
                subject: "AI Fundamentals",
                department: "Computer Science",
                experience: "8 years",
                qualification: "Ph.D. in Computer Science",
                status: "active"
            }
        ];
        await Faculty_1.Faculty.insertMany(faculties);
        console.log("Faculty seeded successfully!");
        console.log("Data seeding finished! Closing connection...");
        await mongoose_1.default.connection.close();
        console.log("Database connection closed.");
        process.exit(0);
    }
    catch (err) {
        console.error("Database seeding failed:", err);
        process.exit(1);
    }
};
seedData();
