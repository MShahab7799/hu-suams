// ============================================================
//  Registration API Route — POST /api/auth/register
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB, writeLocalDB } from '@/lib/db';
import { registerSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const {
      fullName,
      email,
      password,
      role,
      universityId,
      cnic,
      mobileNumber,
      gender,
      facultyId,
      departmentId,
      programId,
      semester,
    } = parsed.data;

    // Check email uniqueness and universityId uniqueness
    const uniquenessCheck = await executeDB(
      async () => {
        const existingEmail = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: { id: true },
        });
        if (existingEmail) return 'email';

        if (universityId) {
          const existingId = await prisma.user.findUnique({
            where: { universityId },
            select: { id: true },
          });
          if (existingId) return 'universityId';
        }
        return null;
      },
      () => {
        const db = readLocalDB();
        const existingEmail = db.users?.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (existingEmail) return 'email';

        if (universityId) {
          const existingId = db.users?.some((u: any) => u.universityId === universityId);
          if (existingId) return 'universityId';
        }
        return null;
      }
    );

    if (uniquenessCheck === 'email') {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }
    if (uniquenessCheck === 'universityId') {
      return NextResponse.json(
        { success: false, error: 'This University ID is already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create User
    const user = await executeDB(
      async () => {
        const u = await prisma.user.create({
          data: {
            fullName,
            email: email.toLowerCase(),
            passwordHash,
            role,
            universityId: universityId || null,
            cnic: cnic || null,
            mobileNumber: mobileNumber || null,
            gender: gender || null,
            facultyId: facultyId || null,
            departmentId: departmentId || null,
            programId: programId || null,
            semester: semester || null,
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
          },
        });

        // Audit Log
        await prisma.auditLog.create({
          data: {
            userId: u.id,
            action: 'Create',
            resource: 'users',
            resourceId: u.id,
            newValue: JSON.stringify({ email: u.email, role: u.role }),
            ipAddress: req.headers.get('x-forwarded-for') ?? 'unknown',
          },
        }).catch(() => {});

        // Welcome Notification
        await prisma.notification.create({
          data: {
            userId: u.id,
            type: 'SystemAlert',
            title: 'Welcome to SUAMS!',
            message: `Welcome to Hazara University Smart Appointment Management System, ${fullName}! Your account has been created successfully.`,
          },
        }).catch(() => {});

        return u;
      },
      () => {
        const db = readLocalDB();
        const newUser = {
          id: 'user-' + Math.random().toString(36).substring(2, 9),
          fullName,
          email: email.toLowerCase(),
          passwordHash,
          role,
          universityId: universityId || null,
          cnic: cnic || null,
          mobileNumber: mobileNumber || null,
          gender: gender || null,
          facultyId: facultyId || null,
          departmentId: departmentId || null,
          programId: programId || null,
          semester: semester || null,
          createdAt: new Date().toISOString(),
          isActive: true,
          isEmailVerified: true
        };
        db.users = db.users || [];
        db.users.push(newUser);

        // Audit log
        db.auditLogs = db.auditLogs || [];
        db.auditLogs.push({
          id: 'audit-' + Math.random(),
          userId: newUser.id,
          action: 'Create',
          resource: 'users',
          resourceId: newUser.id,
          createdAt: new Date().toISOString()
        });

        // Notification
        db.notifications = db.notifications || [];
        db.notifications.push({
          id: 'notif-' + Math.random(),
          userId: newUser.id,
          type: 'SystemAlert',
          title: 'Welcome to SUAMS!',
          message: `Welcome to Hazara University Smart Appointment Management System, ${fullName}! Your account has been created successfully.`,
          isRead: false,
          createdAt: new Date().toISOString()
        });

        writeLocalDB(db);

        return {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          createdAt: new Date(newUser.createdAt),
        };
      }
    );

    return NextResponse.json(
      {
        success: true,
        data: { id: user.id, email: user.email, role: user.role },
        message: 'Account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
