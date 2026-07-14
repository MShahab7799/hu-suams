// ============================================================
//  Appointments API — GET / POST /api/appointments
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB, writeLocalDB } from '@/lib/db';
import { createAppointmentSchema, paginationSchema } from '@/lib/validations';
import { generateAppointmentNo } from '@/lib/utils';
import type { UserRole } from '@/types';

// ── GET /api/appointments ────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const { page, limit, search, sortOrder } = paginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      sortOrder: searchParams.get('sortOrder'),
    });

    const userId = (session.user as any).id as string;
    const role = (session.user as any).role as UserRole;

    const where: any = {};
    if (role === 'Admin') {
      if (search) {
        where.OR = [
          { appointmentNo: { contains: search } },
          { purpose: { contains: search } },
        ];
      }
    } else if (
      ['ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD',
       'Director', 'AdmissionOfficer', 'ExaminationOfficer'].includes(role)
    ) {
      // Find official record
      const official = await prisma.official.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (official) {
        where.officialId = official.id;
      } else {
        where.officialId = 'none';
      }
    } else {
      where.bookedById = userId;
    }

    const result = await executeDB(
      async () => {
        const [appointments, total] = await Promise.all([
          prisma.appointment.findMany({
            where,
            include: {
              official: {
                include: {
                  user: { select: { fullName: true, profilePicture: true } },
                  faculty: { select: { name: true, shortName: true } },
                  department: { select: { name: true } },
                },
              },
              bookedBy: {
                select: { id: true, fullName: true, email: true, universityId: true },
              },
            },
            orderBy: [{ appointmentDate: sortOrder as 'asc' | 'desc' }],
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.appointment.count({ where }),
        ]);
        return { appointments, total };
      },
      async () => {
        const db = await readLocalDB();
        let appts = db.appointments || [];

        // Apply filters based on role
        if (role !== 'Admin') {
          if (['ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD', 'Director', 'AdmissionOfficer', 'ExaminationOfficer'].includes(role)) {
            const official = db.officials?.find((o: any) => o.userId === userId);
            appts = appts.filter((a: any) => a.officialId === official?.id);
          } else {
            appts = appts.filter((a: any) => a.bookedById === userId);
          }
        }

        // Apply search
        if (search) {
          appts = appts.filter((a: any) =>
            a.appointmentNo.toLowerCase().includes(search.toLowerCase()) ||
            a.purpose.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Apply sort
        appts.sort((a: any, b: any) => {
          const tA = new Date(a.appointmentDate).getTime();
          const tB = new Date(b.appointmentDate).getTime();
          return sortOrder === 'asc' ? tA - tB : tB - tA;
        });

        const total = appts.length;
        const start = (page - 1) * limit;
        const paginated = appts.slice(start, start + limit).map((a: any) => {
          const official = db.officials?.find((o: any) => o.id === a.officialId);
          const student = db.users?.find((u: any) => u.id === a.bookedById);
          return {
            ...a,
            official: {
              id: official?.id,
              title: official?.title,
              user: { fullName: official?.user?.fullName || 'Official' },
            },
            bookedBy: {
              fullName: student?.fullName || 'Student',
              email: student?.email || '',
              universityId: student?.universityId || '',
            }
          };
        });

        return { appointments: paginated, total };
      }
    );

    const totalPages = Math.ceil(result.total / limit);

    return NextResponse.json({
      success: true,
      data: result.appointments,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('[GET_APPOINTMENTS]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ── POST /api/appointments ───────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const body = await req.json();

    const parsed = createAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { officialId, appointmentDate, startTime, purpose, notes, isUrgent } = parsed.data;

    // Check duplicate bookings, limit and insert in db
    const createdAppointment = await executeDB(
      async () => {
        const official = await prisma.official.findUnique({
          where: { id: officialId },
          include: { user: { select: { fullName: true } } },
        });
        if (!official || !official.isAvailable) {
          throw new Error('Official not found or not available');
        }

        // Daily limit check
        const dayStart = new Date(appointmentDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(appointmentDate);
        dayEnd.setHours(23, 59, 59, 999);

        const dailyCount = await prisma.appointment.count({
          where: {
            officialId,
            appointmentDate: { gte: dayStart, lte: dayEnd },
            status: { notIn: ['Cancelled', 'Rejected'] },
          },
        });
        if (dailyCount >= official.maxDailyAppointments) {
          throw new Error('This official has reached their daily appointment limit.');
        }

        // End time calculation
        const [h, m] = startTime.split(':').map(Number);
        const endMinutes = h * 60 + m + official.appointmentDurationMins;
        const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

        const apt = await prisma.appointment.create({
          data: {
            appointmentNo: generateAppointmentNo(),
            officialId,
            bookedById: userId,
            appointmentDate: new Date(appointmentDate),
            startTime,
            endTime,
            purpose,
            notes: notes || null,
            isUrgent: isUrgent ?? false,
            status: 'Pending',
          },
        });

        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            appointmentId: apt.id,
            type: 'AppointmentBooked',
            title: 'Appointment Submitted',
            message: `Your appointment request with ${official.user.fullName} has been submitted successfully.`,
          },
        }).catch(() => {});

        return { ...apt, officialName: official.user.fullName };
      },
      async () => {
        const db = await readLocalDB();
        const official = db.officials?.find((o: any) => o.id === officialId);
        if (!official || !official.isAvailable) {
          throw new Error('Official not found or not available');
        }

        const apptNo = generateAppointmentNo();
        const [h, m] = startTime.split(':').map(Number);
        const endMinutes = h * 60 + m + (official.appointmentDurationMins || 20);
        const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

        const newApt = {
          id: 'apt-' + Math.random().toString(36).substring(2, 9),
          appointmentNo: apptNo,
          officialId,
          bookedById: userId,
          timeSlotId: null as string | null,
          appointmentDate: new Date(appointmentDate),
          startTime,
          endTime,
          purpose,
          notes: notes || null,
          status: 'Pending',
          rejectionReason: null as string | null,
          rescheduleReason: null as string | null,
          isUrgent: isUrgent ?? false,
          reminderSent: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        db.appointments = db.appointments || [];
        db.appointments.push({
          ...newApt,
          appointmentDate: newApt.appointmentDate.toISOString(),
          createdAt: newApt.createdAt.toISOString(),
          updatedAt: newApt.updatedAt.toISOString(),
        });

        // Add notification
        db.notifications = db.notifications || [];
        db.notifications.push({
          id: 'notif-' + Math.random(),
          userId,
          appointmentId: newApt.id,
          type: 'AppointmentBooked',
          title: 'Appointment Submitted',
          message: `Your appointment request with ${official.user?.fullName || 'Official'} has been submitted successfully.`,
          isRead: false,
          createdAt: new Date().toISOString(),
        });

        await writeLocalDB(db);
        return { ...newApt, officialName: official.user?.fullName || 'Official' };
      }
    );

    return NextResponse.json(
      { success: true, data: createdAppointment, message: 'Appointment booked successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[CREATE_APPOINTMENT]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
