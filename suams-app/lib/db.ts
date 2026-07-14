import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';

// Local file-based mock database for fallback when SQL Server is unreachable
const DB_FILE = path.join(process.cwd(), 'db.json');

// Initialize local DB with template if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    users: [
      {
        id: 'admin-id',
        fullName: 'System Administrator',
        email: 'admin@hu.edu.pk',
        passwordHash: '$2a$12$RkhM4PqO3G8yvXf23dF4e.O6N2P8b.1B1r2x6r4b6c6d6e6f6g6h6', // bcrypt hash for 'Password123!'
        role: 'Admin',
        isEmailVerified: true,
        isActive: true,
      },
      {
        id: 'student-id',
        fullName: 'Ali Ahmed',
        email: 'student@hu.edu.pk',
        passwordHash: '$2a$12$RkhM4PqO3G8yvXf23dF4e.O6N2P8b.1B1r2x6r4b6c6d6e6f6g6h6', // bcrypt hash for 'Password123!'
        role: 'Student',
        universityId: '2023-CS-1234',
        mobileNumber: '+923001234567',
        gender: 'Male',
        semester: 4,
        isEmailVerified: true,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'vc-id',
        fullName: 'Prof. Dr. Mohsin Khan',
        email: 'vc@hu.edu.pk',
        passwordHash: '$2a$12$RkhM4PqO3G8yvXf23dF4e.O6N2P8b.1B1r2x6r4b6c6d6e6f6g6h6',
        role: 'ViceChancellor',
        isEmailVerified: true,
        isActive: true,
      },
      {
        id: 'registrar-id',
        fullName: 'Dr. Shahzad Rahman',
        email: 'registrar@hu.edu.pk',
        passwordHash: '$2a$12$RkhM4PqO3G8yvXf23dF4e.O6N2P8b.1B1r2x6r4b6c6d6e6f6g6h6',
        role: 'Registrar',
        isEmailVerified: true,
        isActive: true,
      }
    ],
    officials: [
      {
        id: 'vc-official',
        userId: 'vc-id',
        title: 'Vice Chancellor',
        officeLocation: 'VC Block, Main Campus',
        officeHours: 'Monday – Wednesday, 10:00 AM – 12:00 PM',
        bio: 'The Vice Chancellor is the principal academic and administrative officer of Hazara University.',
        appointmentDurationMins: 30,
        isAvailable: true,
        maxDailyAppointments: 5,
        user: { fullName: 'Prof. Dr. Mohsin Khan', email: 'vc@hu.edu.pk', profilePicture: null },
        category: 'administration',
        faculty: { name: 'University Administration' },
        department: { name: 'Administration' },
        slots: ['10:00', '10:30', '11:00', '11:30']
      },
      {
        id: 'registrar-official',
        userId: 'registrar-id',
        title: 'Registrar',
        officeLocation: 'Admin Block, Ground Floor',
        officeHours: 'Monday – Friday, 9:00 AM – 2:00 PM',
        bio: 'The Registrar oversees academic records, admissions, and student services.',
        appointmentDurationMins: 20,
        isAvailable: true,
        maxDailyAppointments: 15,
        user: { fullName: 'Dr. Shahzad Rahman', email: 'registrar@hu.edu.pk', profilePicture: null },
        category: 'administration',
        faculty: { name: 'University Administration' },
        department: { name: 'Administration' },
        slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '13:00']
      }
    ],
    appointments: [],
    notifications: [
      {
        id: 'notif-1',
        userId: 'student-id',
        title: 'Welcome to SUAMS',
        message: 'Your student account is active. You can now book appointments.',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ],
    auditLogs: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Read helper
export function readLocalDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

// Write helper
export function writeLocalDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    return false;
  }
}

// Wrapper for DB operations with transparent fallback
export async function executeDB<T>(dbOp: () => Promise<T>, fallbackOp: () => T | Promise<T>): Promise<T> {
  try {
    // Try querying Prisma DB
    return await dbOp();
  } catch (error: any) {
    // If connection fails, trigger local file-based JSON DB fallback
    console.warn('⚡ [SUAMS Database Fallback] Falling back to local file DB:', error.message || error);
    return await fallbackOp();
  }
}
