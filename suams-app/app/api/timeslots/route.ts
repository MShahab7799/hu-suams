import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB, writeLocalDB } from '@/lib/db';
import type { UserRole } from '@/types';

// Retrieve timeslots
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    let officialId = searchParams.get('officialId');
    const userId = (session.user as any).id as string;
    const role = (session.user as any).role as UserRole;

    // If no officialId parameter, but current user is an official, default to their own slots
    if (!officialId && ['ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD', 'Director', 'AdmissionOfficer', 'ExaminationOfficer'].includes(role)) {
      const official = await executeDB(
        async () => {
          return await prisma.official.findUnique({
            where: { userId },
            select: { id: true }
          });
        },
        () => {
          const db = readLocalDB();
          return db.officials?.find((o: any) => o.userId === userId);
        }
      );
      if (official) {
        officialId = official.id;
      }
    }

    if (!officialId) {
      return NextResponse.json({ success: false, error: 'officialId is required' }, { status: 400 });
    }

    const slots = await executeDB(
      async () => {
        return await prisma.timeSlot.findMany({
          where: { officialId, isActive: true },
          orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }]
        });
      },
      () => {
        const db = readLocalDB();
        let list = db.timeSlots || [];
        list = list.filter((s: any) => s.officialId === officialId && s.isActive !== false);
        list.sort((a: any, b: any) => {
          if (a.dayOfWeek !== b.dayOfWeek) {
            return a.dayOfWeek - b.dayOfWeek;
          }
          return a.startTime.localeCompare(b.startTime);
        });
        return list;
      }
    );

    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    console.error('[GET_TIMESLOTS]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// Add a timeslot
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { dayOfWeek, startTime, endTime, officialId } = body;

    if (dayOfWeek === undefined || !startTime || !endTime || !officialId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newSlot = await executeDB(
      async () => {
        return await prisma.timeSlot.create({
          data: {
            officialId,
            dayOfWeek: Number(dayOfWeek),
            startTime,
            endTime,
            isActive: true
          }
        });
      },
      () => {
        const db = readLocalDB();
        db.timeSlots = db.timeSlots || [];
        const slot = {
          id: 'slot-' + Math.random().toString(36).substring(2, 9),
          officialId: String(officialId),
          dayOfWeek: Number(dayOfWeek),
          startTime: String(startTime),
          endTime: String(endTime),
          isActive: true,
          createdAt: new Date()
        };
        db.timeSlots.push({
          ...slot,
          createdAt: slot.createdAt.toISOString()
        });
        writeLocalDB(db);
        return slot;
      }
    );

    return NextResponse.json({ success: true, data: newSlot });
  } catch (error: any) {
    console.error('[POST_TIMESLOT]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Delete a timeslot
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    await executeDB(
      async () => {
        await prisma.timeSlot.delete({
          where: { id }
        });
      },
      () => {
        const db = readLocalDB();
        db.timeSlots = db.timeSlots || [];
        db.timeSlots = db.timeSlots.filter((s: any) => s.id !== id);
        writeLocalDB(db);
      }
    );

    return NextResponse.json({ success: true, message: 'Time slot deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE_TIMESLOT]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
