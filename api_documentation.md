# EduCore Backend API Documentation

This document serves as the complete, production-ready API directory for the EduCore Student and Portal Dashboard. 

All endpoints support two URL configurations:
1. **API Namespace Prefix**: `/api/...` (e.g. `/api/auth/login`)
2. **Direct Root Path (Compatibility Mode)**: `/...` (e.g. `/login`)

---

## 📌 Table of Contents
1. [Authentication Endpoints](#1-authentication-endpoints)
2. [Profile Endpoints](#2-profile-endpoints)
3. [Student Portal Endpoints (Student Guarded)](#3-student-portal-endpoints-student-guarded)
4. [Admin Portal Endpoints (Admin Guarded)](#4-admin-portal-endpoints-admin-guarded)
5. [Public Forms & Marketing Endpoints](#5-public-forms--marketing-endpoints)

---

## 1. Authentication Endpoints

### Login User
* **URL**: `/api/auth/login` (Alias: `/login`)
* **Method**: `POST`
* **Headers**: None
* **Description**: Authenticates user email and password against the selected role and issues a JWT authorization token.
* **Request Payload**:
  ```json
  {
    "email": "student@educore.com",
    "password": "demo123password",
    "role": "student" // "student" | "admin"
  }
  ```
* **Response Success (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "CS2021001",
      "name": "Alex Johnson",
      "email": "student@educore.com",
      "role": "student",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      "rollNumber": "CS2021001",
      "department": "Computer Science",
      "semester": "6th",
      "phone": "+1 (555) 123-4567",
      "address": "123 Campus Drive, University City",
      "joinDate": "August 2021"
    }
  }
  ```
* **Response Error (401 Unauthorized)**:
  ```json
  {
    "error": "Invalid email, password, or role selection."
  }
  ```

### Register User
* **URL**: `/api/auth/register` (Alias: `/register`)
* **Method**: `POST`
* **Headers**: None
* **Description**: Registers a new student or admin user record.
* **Request Payload**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@educore.com",
    "password": "securepassword123",
    "role": "student" // "student" | "admin"
  }
  ```
* **Response Success (201 Created)**:
  ```json
  {
    "message": "Account created successfully. Please log in.",
    "userId": "CS1717586"
  }
  ```

### Forgot Password Link
* **URL**: `/api/auth/forgot-password` (Alias: `/forgot-password`)
* **Method**: `POST`
* **Headers**: None
* **Description**: Dispatches a recovery link to the user's email address.
* **Request Payload**:
  ```json
  {
    "email": "student@educore.com"
  }
  ```
* **Response Success (200 OK)**:
  ```json
  {
    "message": "Password reset link sent to student@educore.com"
  }
  ```

---

## 2. Profile Endpoints

### Update Profile
* **URL**: `/api/profile/update` (Alias: `/profile/update`)
* **Method**: `PUT`
* **Headers**: 
  * `Authorization: Bearer <token>`
* **Description**: Updates profile text details for the authenticated user.
* **Request Payload**:
  ```json
  {
    "name": "Alex Johnson",
    "phone": "+1 (555) 999-8888",
    "address": "456 Campus Lane, University City"
  }
  ```
* **Response Success (200 OK)**:
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": "CS2021001",
      "name": "Alex Johnson",
      "email": "student@educore.com",
      "role": "student",
      "avatar": "https://...",
      "rollNumber": "CS2021001",
      "department": "Computer Science",
      "semester": "6th",
      "phone": "+1 (555) 999-8888",
      "address": "456 Campus Lane, University City"
    }
  }
  ```

### Upload Profile Picture
* **URL**: `/api/profile/avatar` (Alias: `/profile/avatar`)
* **Method**: `PATCH`
* **Headers**: 
  * `Authorization: Bearer <token>`
* **Description**: Updates the avatar image URL for the authenticated user.
* **Request Payload**:
  ```json
  {
    "avatarUrl": "https://educore-storage.s3.amazonaws.com/avatars/s001.jpg"
  }
  ```
* **Response Success (200 OK)**:
  ```json
  {
    "avatarUrl": "https://educore-storage.s3.amazonaws.com/avatars/s001.jpg"
  }
  ```

---

## 3. Student Portal Endpoints (Student Guarded)

All routes in this section require verification of a student authentication token.

### Get Attendance Records
* **URL**: `/api/student/attendance` (Alias: `/student/attendance`)
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <student_token>`
* **Description**: Fetches detailed subject-wise attendance percentages and counts for the logged-in student.
* **Response Success (200 OK)**:
  ```json
  [
    {
      "studentId": "CS2021001",
      "subject": "Data Structures",
      "total": 45,
      "attended": 42,
      "percentage": 93
    },
    {
      "studentId": "CS2021001",
      "subject": "Operating Systems",
      "total": 40,
      "attended": 35,
      "percentage": 87
    }
  ]
  ```

### Get Monthly Attendance Trend
* **URL**: `/api/student/attendance/trend` (Alias: `/student/attendance/trend`)
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <student_token>`
* **Description**: Fetches historical attendance percentages across months for charts.
* **Response Success (200 OK)**:
  ```json
  [
    {
      "studentId": "CS2021001",
      "month": "Jan",
      "attendance": 88
    },
    {
      "studentId": "CS2021001",
      "month": "Feb",
      "attendance": 92
    }
  ]
  ```

### Get Assignments List
* **URL**: `/api/student/assignments` (Alias: `/student/assignments`)
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <student_token>`
* **Description**: Fetches assignments, scores, description and status flags.
* **Response Success (200 OK)**:
  ```json
  [
    {
      "id": "a1",
      "title": "Binary Search Tree Implementation",
      "subject": "Data Structures",
      "dueDate": "2024-06-15",
      "status": "pending",
      "marks": null,
      "maxMarks": 20,
      "description": "Implement BST with insert, delete, and search operations in C++."
    }
  ]
  ```

### Submit Assignment File
* **URL**: `/api/student/assignments/:id/submit` (Alias: `/student/assignments/:id/submit`)
* **Method**: `POST`
* **Headers**: 
  * `Authorization: Bearer <student_token>`
* **Description**: Uploads assignment file URL along with optional submission notes.
* **Request Payload**:
  ```json
  {
    "fileUrl": "https://educore-storage.s3.amazonaws.com/submissions/s001.zip",
    "notes": "Code comments added."
  }
  ```
* **Response Success (200 OK)**:
  ```json
  {
    "message": "Assignment submitted successfully",
    "submittedAt": "2026-06-03T16:42:27.000Z",
    "status": "submitted"
  }
  ```

### Get Academic Results by ID
* **URL**: `/api/student/results/:id` (Alias: `/student/results/:id`)
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <student_token>`
* **Description**: Fetches semester-wise lists of subjects, marks, SGPA, and cumulative CGPA for a student by their ID.
* **Response Success (200 OK)**:
  ```json
  [
    {
      "studentId": "CS2021001",
      "semester": "Semester 5",
      "year": "2023-24",
      "subjects": [
        { "name": "Data Structures", "internal": 28, "external": 62, "total": 90, "grade": "A+" }
      ],
      "sgpa": 9.2,
      "cgpa": 8.8
    }
  ]
  ```

### Get Timetable
* **URL**: `/api/student/timetable` (Alias: `/student/timetable`)
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <student_token>`
* **Description**: Retrieves weekly schedule slots mapped by days.
* **Response Success (200 OK)**:
  ```json
  {
    "Monday": [
      { "time": "9:00 - 10:00", "subject": "Data Structures", "room": "CS-101", "faculty": "Prof. Williams" }
    ]
  }
  ```

---

## 4. Admin Portal Endpoints (Admin Guarded)

All routes in this section require verification of an admin authorization token.

### Get Admin Dashboard Metrics
* **URL**: `/api/admin/metrics` (Alias: `/admin/metrics`)
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: High-level statistical cards metrics for the main screen.
* **Response Success (200 OK)**:
  ```json
  {
    "totalStudents": 8,
    "totalFaculty": 46,
    "totalCourses": 89,
    "activeNotices": 4,
    "attendanceRate": 87.3,
    "passRate": 94.2
  }
  ```

### Student Resource (CRUD)
* **URL**: `/api/admin/students` (Alias: `/admin/students`)
* **Method**: `GET` | `POST`
* **URL (Specific)**: `/api/admin/students/:id` (Alias: `/admin/students/:id`)
* **Method (Specific)**: `PUT` | `DELETE`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Admin CRUD operations for managing student registers.
* **POST Request Payload**:
  ```json
  {
    "id": "CS2021009",
    "name": "Jane Johnson",
    "email": "jane.j@student.edu",
    "phone": "+1 555-9009",
    "department": "Computer Science",
    "semester": "6th",
    "attendance": 95,
    "cgpa": 9.2,
    "status": "active"
  }
  ```
* **Response Success (POST - 201 Created)**:
  ```json
  {
    "message": "Student record created successfully.",
    "student": {
      "id": "CS2021009",
      "name": "Jane Johnson",
      "email": "jane.j@student.edu",
      "phone": "+1 555-9009",
      "department": "Computer Science",
      "semester": "6th",
      "attendance": 95,
      "cgpa": 9.2,
      "status": "active"
    }
  }
  ```

### Faculty Resource (CRUD)
* **URL**: `/api/admin/faculty` (Alias: `/admin/faculty`)
* **Method**: `GET` | `POST`
* **URL (Specific)**: `/api/admin/faculty/:id` (Alias: `/admin/faculty/:id`)
* **Method (Specific)**: `PUT` | `DELETE`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Admin CRUD operations for managing faculty registers.
* **POST Request Payload**:
  ```json
  {
    "id": "F007",
    "name": "Prof. David Lee",
    "email": "lee@faculty.edu",
    "phone": "+1 555-7007",
    "subject": "AI Fundamentals",
    "department": "Computer Science",
    "experience": "8 years",
    "qualification": "Ph.D. in Computer Science",
    "status": "active"
  }
  ```
* **Response Success (POST - 201 Created)**:
  ```json
  {
    "message": "Faculty record created successfully.",
    "faculty": {
      "id": "F007",
      "name": "Prof. David Lee",
      "email": "lee@faculty.edu",
      "phone": "+1 555-7007",
      "subject": "AI Fundamentals",
      "department": "Computer Science",
      "experience": "8 years",
      "qualification": "Ph.D. in Computer Science",
      "status": "active"
    }
  }
  ```

### Timetable Classes (CRUD)
* **URL**: `/api/admin/timetable` (Alias: `/admin/timetable`)
* **Method**: `GET` | `POST`
* **URL (Specific)**: `/api/admin/timetable/:day/:index` (Alias: `/admin/timetable/:day/:index`)
* **Method (Specific)**: `PUT` | `DELETE`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Modifies weekday class timetable slots.
* **POST Request Payload** (Create Day):
  ```json
  {
    "day": "Monday",
    "slots": [],
    "roleScope": "all"
  }
  ```
* **PUT Request Payload** (Modify Slot at Index):
  ```json
  {
    "time": "09:00 - 10:00",
    "subject": "Operating Systems",
    "faculty": "Prof. Davis",
    "room": "CS-102"
  }
  ```
* **Response Success (PUT - 200 OK)**:
  ```json
  {
    "message": "Timetable schedule slot updated successfully.",
    "timetable": {
      "day": "Monday",
      "slots": [
        { "time": "09:00 - 10:00", "subject": "Operating Systems", "faculty": "Prof. Davis", "room": "CS-102" }
      ],
      "roleScope": "all"
    }
  }
  ```
* **Response Success (DELETE - 200 OK)**:
  ```json
  {
    "message": "Timetable slot deleted successfully.",
    "timetable": {
      "day": "Monday",
      "slots": []
    }
  }
  ```

### Notices (CRUD & Toggle Publish)
* **URL**: `/api/admin/notices` (Alias: `/admin/notices`)
* **Method**: `GET` | `POST`
* **URL (Specific)**: `/api/admin/notices/:id` (Alias: `/admin/notices/:id`)
* **Method (Specific)**: `PUT` | `DELETE` | `PATCH`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Create, update, delete notices, and change publish status.
* **PATCH (Toggle Publish Status) Request Payload**:
  ```json
  {
    "published": true
  }
  ```
* **Response Success (PATCH - 200 OK)**:
  ```json
  {
    "message": "Notice published successfully.",
    "notice": {
      "_id": "60a72b12f10b7c001f3e7a55",
      "title": "Examination Schedule",
      "published": true
    }
  }
  ```

### Get All Student Results
* **URL**: `/api/admin/results` (Alias: `/admin/results`)
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Fetches all academic results for all students in the database.
* **Response Success (200 OK)**:
  ```json
  [
    {
      "studentId": "CS2021001",
      "semester": "Semester 5",
      "year": "2023-24",
      "subjects": [
        { "name": "Data Structures", "internal": 28, "external": 62, "total": 90, "grade": "A+" }
      ],
      "sgpa": 9.2,
      "cgpa": 8.8
    }
  ]
  ```

### Semester Results Management
* **URL**: `/api/admin/students/:id/results` (Alias: `/admin/students/:id/results`)
* **Method**: `GET` | `POST`
* **URL (Specific)**: `/api/admin/students/:id/results/:semester` (Alias: `/admin/students/:id/results/:semester`)
* **Method (Specific)**: `DELETE`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Manage complete semester result pages for a specific student.
* **POST Request Payload**:
  ```json
  {
    "semester": "Semester 5",
    "year": "2023-24",
    "subjects": [
      { "name": "Data Structures", "internal": 28, "external": 62 }
    ]
  }
  ```
* **Response Success (POST - 201 Created)**:
  ```json
  {
    "message": "Semester results successfully published.",
    "result": {
      "studentId": "CS2021001",
      "semester": "Semester 5",
      "year": "2023-24",
      "subjects": [
        { "name": "Data Structures", "internal": 28, "external": 62, "total": 90, "grade": "A+" }
      ],
      "sgpa": 9.0,
      "cgpa": 8.8
    }
  }
  ```

### Semester Result GPA Adjustments
* **URL**: `/api/admin/students/:id/results/:semester/gpa` (Alias: `/admin/students/:id/results/:semester/gpa`)
* **Method**: `PUT`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Directly edits SGPA and CGPA metrics.
* **Request Payload**:
  ```json
  {
    "sgpa": 9.4,
    "cgpa": 8.9
  }
  ```

### Result Subject Item Management
* **URL**: `/api/admin/students/:id/results/:semester/subjects` (Alias: `/admin/students/:id/results/:semester/subjects`)
* **Method**: `POST`
* **URL (Specific)**: `/api/admin/students/:id/results/:semester/subjects/:index` (Alias: `/api/admin/students/:id/results/:semester/subjects/:index`)
* **Method (Specific)**: `PUT` | `DELETE`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Manage subject-specific grades inside an existing semester document.
* **POST Request Payload**:
  ```json
  {
    "name": "Operating Systems",
    "internal": 25,
    "external": 55
  }
  ```
* **Response Success (POST - 200 OK)**:
  ```json
  {
    "message": "Subject record added successfully.",
    "result": {
      "studentId": "CS2021001",
      "semester": "Semester 5",
      "subjects": [
        ...
        { "name": "Operating Systems", "internal": 25, "external": 55, "total": 80, "grade": "A" }
      ],
      "sgpa": 8.48,
      "cgpa": 8.69
    }
  }
  ```

### Analytics Reports
* **URL**: `/api/admin/analytics/enrollment-growth` (Alias: `/admin/analytics/enrollment-growth`)
* **Method**: `GET`
* **Headers**: 
  * `Authorization: Bearer <admin_token>`
* **Description**: Retrieves month-by-month student growth rates.
* **Response Success (200 OK)**:
  ```json
  [
    {"month": "Aug", "students": 2720},
    {"month": "Sep", "students": 2780}
  ]
  ```

---

## 5. Public Forms & Marketing Endpoints

### Contact Form Message
* **URL**: `/api/marketing/contact` (Alias: `/marketing/contact`)
* **Method**: `POST`
* **Headers**: None
* **Description**: Receives contact page inquiries.
* **Request Payload**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@company.com",
    "subject": "Platform Trial Details",
    "message": "We would like to request an enterprise-level demo for 3000 students.",
    "type": "sales"
  }
  ```
* **Response Success (200 OK)**:
  ```json
  {
    "message": "Inquiry received. Thank you for contacting EduCore support."
  }
  ```

### Newsletter Subscription
* **URL**: `/api/marketing/newsletter` (Alias: `/marketing/newsletter`)
* **Method**: `POST`
* **Headers**: None
* **Description**: Subscribes user email to newsletter list.
* **Request Payload**:
  ```json
  {
    "email": "subscriber@email.com"
  }
  ```
* **Response Success (200 OK)**:
  ```json
  {
    "message": "Subscribed successfully!"
  }
  ```

### Get Blog Posts List
* **URL**: `/api/blog/posts` (Alias: `/blog/posts`)
* **Method**: `GET`
* **Headers**: None
* **Description**: Fetches blog posts sorted by date.

### Get Detailed Blog Article
* **URL**: `/api/blog/posts/:id` (Alias: `/blog/posts/:id`)
* **Method**: `GET`
* **Headers**: None
* **Description**: Fetches full article content by ID.

### Portal billing Checkout
* **URL**: `/api/payment/checkout` (Alias: `/payment/checkout`)
* **Method**: `POST`
* **Headers**: 
  * `Authorization: Bearer <token>`
* **Description**: Processes mock portal billing checkout transactions.
* **Request Payload**:
  ```json
  {
    "planName": "EduCore Enterprise",
    "billingCycle": "yearly",
    "amountPaid": 490,
    "cardDetails": "Visa **** 4242"
  }
  ```
* **Response Success (200 OK)**:
  ```json
  {
    "message": "Payment verified and processed successfully.",
    "transactionId": "TXN_17175862211902",
    "amountPaid": 490,
    "timestamp": "2026-06-05T10:00:00.000Z"
  }
  ```
