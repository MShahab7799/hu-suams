import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const facultyId = searchParams.get('facultyId');

    const departments = await executeDB(
      async () => {
        return await prisma.department.findMany({
          where: {
            isActive: true,
            ...(facultyId ? { facultyId } : {}),
          },
          orderBy: { name: 'asc' },
        });
      },
      async () => {
        const db = await readLocalDB();
        let list = db.departments || [];
        if (facultyId) {
          list = list.filter((d: any) => d.facultyId === facultyId);
        }
        return list;
      }
    );

    return NextResponse.json({ success: true, data: departments });
  } catch (error) {
    console.error('[GET_DEPARTMENTS]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
