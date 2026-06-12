-- =============================================
-- ✅ SCHOOL MANAGEMENT SYSTEM - SUPABASE SCHEMA
-- ✅ RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    studentId TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    otherNames TEXT,
    gender TEXT,
    dateOfBirth DATE,
    class TEXT,
    admissionDate DATE,
    guardianName TEXT,
    guardianPhone TEXT,
    guardianEmail TEXT,
    address TEXT,
    status TEXT DEFAULT 'active',
    profilePhoto TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    teacherId TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    gender TEXT,
    phone TEXT,
    email TEXT,
    subject TEXT,
    qualification TEXT,
    dateJoined DATE,
    address TEXT,
    status TEXT DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Classes Table
CREATE TABLE IF NOT EXISTS classes (
    id TEXT PRIMARY KEY,
    className TEXT UNIQUE NOT NULL,
    classTeacher TEXT,
    capacity INTEGER DEFAULT 40,
    roomNumber TEXT,
    description TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    remarks TEXT,
    markedBy TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    UNIQUE(studentId, date)
);

-- Fees Table
CREATE TABLE IF NOT EXISTS fees (
    id TEXT PRIMARY KEY,
    studentId TEXT NOT NULL,
    receiptNo TEXT UNIQUE NOT NULL,
    term TEXT NOT NULL,
    academicYear TEXT,
    totalAmount DECIMAL(10,2) DEFAULT 0,
    amountPaid DECIMAL(10,2) DEFAULT 0,
    paymentDate DATE,
    paymentMethod TEXT,
    remarks TEXT,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    userId TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT NOW(),
    lastLogin TIMESTAMP
);

-- =============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(studentId);
CREATE INDEX IF NOT EXISTS idx_fees_student ON fees(studentId);
CREATE INDEX IF NOT EXISTS idx_users_userid ON users(userId);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY (OPTIONAL)
-- =============================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREATE POLICIES (ALLOW ALL FOR NOW)
-- =============================================

CREATE POLICY "Allow all operations for authenticated users" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON teachers FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON classes FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON attendance FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON fees FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (true);

-- =============================================
-- 5. CREATE DEFAULT ADMIN USER
-- =============================================

INSERT INTO users (id, name, userId, password, role)
VALUES (
  'admin_1',
  'System Administrator',
  'Master1',
  'admin123',
  'admin'
) ON CONFLICT (userId) DO NOTHING;

-- =============================================
-- ✅ SCHEMA SETUP COMPLETE!
-- =============================================
-- AFTER RUNNING THIS:
-- 1. Go to Supabase Dashboard → Authentication → Policies
-- 2. Confirm all tables have policies enabled
-- 3. Your database is now ready for the application
-- 4. Open index.html and login with: Master1 / admin123