// ============================================================
//  Single Appointment API — GET / PATCH /api/appointments/[id]
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB, writeLocalDB } from '@/lib/db';
import { updateAppointmentStatusSchema } from '@/lib/validations';
import type { UserRole } from '@/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id as string;
    const role = (session.user as any).role as UserRole;

    const appointment = await executeDB(
      async () => {
        return await prisma.appointment.findUnique({
          where: { id },
          include: {
            official: {
              include: {
                user: { select: { fullName: true, email: true, profilePicture: true, mobileNumber: true } },
                faculty: { select: { name: true, shortName: true } },
                department: { select: { name: true } },
              },
            },
            bookedBy: {
              select: { id: true, fullName: true, email: true, universityId: true, mobileNumber: true, role: true },
            },
          },
        });
      },
      () => {
        const db = readLocalDB();
        const a = db.appointments?.find((item: any) => item.id === id);
        if (!a) return null;

        const official = db.officials?.find((o: any) => o.id === a.officialId);
        const bookedBy = db.users?.find((u: any) => u.id === a.bookedById);

        return {
          ...a,
          official: {
            id: official?.id,
            title: official?.title,
            officeLocation: official?.officeLocation,
            user: {
              fullName: official?.user?.fullName || 'Official',
              email: official?.user?.email || '',
              profilePicture: official?.user?.profilePicture || null,
              mobileNumber: official?.user?.mobileNumber || '',
            },
            faculty: { name: official?.faculty?.name || '' },
            department: { name: official?.department?.name || '' },
          },
          bookedBy: {
            id: bookedBy?.id,
            fullName: bookedBy?.fullName || 'Student',
            email: bookedBy?.email || '',
            universityId: bookedBy?.universityId || '',
            mobileNumber: bookedBy?.mobileNumber || '',
            role: bookedBy?.role || 'Student',
          }
        };
      }
    );

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    // Access control
    const isOwner = appointment.bookedById === userId;
    const isOfficialUser = appointment.official.userId === userId || appointment.official.id === userId;
    const isAdmin = role === 'Admin';

    if (!isOwner && !isOfficialUser && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('[GET_APPOINTMENT]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id as string;
    const role = (session.user as any).role as UserRole;
    const body = await req.json();

    const parsed = updateAppointmentStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { status, rejectionReason, rescheduleReason } = parsed.data;

    const result = await executeDB(
      async () => {
        const appointment = await prisma.appointment.findUnique({
          where: { id },
          include: {
            official: { include: { user: { select: { id: true, fullName: true } } } },
            bookedBy: { select: { id: true, fullName: true, email: true } },
          },
        });

        if (!appointment) throw new Error('Appointment not found');

        // Update in db
        const updated = await prisma.appointment.update({
          where: { id },
          data: {
            status,
            rejectionReason: rejectionReason || null,
            rescheduleReason: rescheduleReason || null,
            updatedAt: new Date(),
          },
        });

        // Notifications and Audit log
        await prisma.notification.create({
          data: {
            userId: appointment.bookedById,
            appointmentId: id,
            type: status === 'Approved' ? 'AppointmentApproved' : status === 'Rejected' ? 'AppointmentRejected' : 'AppointmentCancelled',
            title: `Appointment ${status}`,
            message: `Your appointment request ${appointment.appointmentNo} has been ${status.toLowerCase()}.`,
          },
        }).catch(() => {});

        return updated;
      },
      () => {
        const db = readLocalDB();
        const idx = db.appointments?.findIndex((item: any) => item.id === id);
        if (idx === -1 || idx === undefined) throw new Error('Appointment not found');

        const appt = db.appointments[idx];
        appt.status = status;
        if (rejectionReason) appt.rejectionReason = rejectionReason;
        if (rescheduleReason) appt.rescheduleReason = rescheduleReason;
        appt.updatedAt = new Date().toISOString();

        // Notification
        db.notifications = db.notifications || [];
        db.notifications.push({
          id: 'notif-' + Math.random(),
          userId: appt.bookedById,
          appointmentId: id,
          type: status === 'Approved' ? 'AppointmentApproved' : status === 'Rejected' ? 'AppointmentRejected' : 'AppointmentCancelled',
          title: `Appointment ${status}`,
          message: `Your appointment request ${appt.appointmentNo} has been ${status.toLowerCase()}.`,
          isRead: false,
          createdAt: new Date().toISOString(),
        });

        writeLocalDB(db);
        return appt;
      }
    );

    return NextResponse.json({ success: true, data: result, message: `Appointment ${status.toLowerCase()}` });
  } catch (error: any) {
    console.error('[UPDATE_APPOINTMENT]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
