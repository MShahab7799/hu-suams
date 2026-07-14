import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB } from '@/lib/db';
import type { UserRole } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const scope = searchParams.get('scope') || 'Daily'; // Daily, Weekly, Monthly

    const userId = (session.user as any).id as string;
    const role = (session.user as any).role as UserRole;

    // Filter appointments by official if requested by official/assistant
    const where: any = {};
    if (['ViceChancellor', 'Registrar', 'Dean', 'Chairman', 'HOD', 'Director', 'AdmissionOfficer', 'ExaminationOfficer'].includes(role)) {
      const official = await executeDB(
        async () => {
          return await prisma.official.findUnique({
            where: { userId },
            select: { id: true }
          });
        },
        async () => {
          const db = await readLocalDB();
          return db.officials?.find((o: any) => o.userId === userId);
        }
      );
      if (official) {
        where.officialId = official.id;
      }
    } else if (role === 'Assistant') {
      // Find VC or Registrar assistant mappings
      const assistant = await executeDB(
        async () => {
          // Assistant schema has officialId
          return await prisma.assistant.findFirst({
            where: { email: session.user?.email || '' }
          });
        },
        async () => {
          const db = await readLocalDB();
          return db.assistants?.find((a: any) => a.email === session.user?.email);
        }
      );
      if (assistant) {
        where.officialId = assistant.officialId;
      }
    }

    const reportData = await executeDB(
      async () => {
        const appts = await prisma.appointment.findMany({
          where,
          include: {
            bookedBy: { select: { fullName: true, role: true, email: true } },
            official: { include: { user: { select: { fullName: true } } } }
          }
        });
        return appts;
      },
      async () => {
        const db = await readLocalDB();
        let list = db.appointments || [];
        if (where.officialId) {
          list = list.filter((a: any) => a.officialId === where.officialId);
        }
        return list.map((a: any) => {
          const official = db.officials?.find((o: any) => o.id === a.officialId);
          const user = db.users?.find((u: any) => u.id === a.bookedById);
          return {
            ...a,
            official: {
              id: official?.id,
              title: official?.title,
              user: { fullName: official?.user?.fullName || 'Official' }
            },
            bookedBy: {
              fullName: user?.fullName || 'User',
              email: user?.email || '',
              role: user?.role || 'Student'
            }
          };
        });
      }
    );

    // Calculate aggregated statistics
    const total = reportData.length;
    const pending = reportData.filter((a: any) => a.status === 'Pending').length;
    const approved = reportData.filter((a: any) => a.status === 'Approved').length;
    const completed = reportData.filter((a: any) => a.status === 'Completed').length;
    const cancelled = reportData.filter((a: any) => a.status === 'Cancelled').length;

    const completionRate = total > 0 ? ((completed / (total - cancelled || 1)) * 100).toFixed(1) : '100';

    return NextResponse.json({
      success: true,
      data: {
        scope,
        summary: {
          total,
          pending,
          approved,
          completed,
          cancelled,
          completionRate: `${completionRate}%`
        },
        appointments: reportData
      }
    });
  } catch (error) {
    console.error('[GET_REPORTS]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
