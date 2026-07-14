import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const departmentId = searchParams.get('departmentId');

    const programs = await executeDB(
      async () => {
        return await prisma.program.findMany({
          where: {
            isActive: true,
            ...(departmentId ? { departmentId } : {}),
          },
          orderBy: { name: 'asc' },
        });
      },
      async () => {
        const db = await readLocalDB();
        let list = db.programs || [];
        if (departmentId) {
          list = list.filter((p: any) => p.departmentId === departmentId);
        }
        return list;
      }
    );

    return NextResponse.json({ success: true, data: programs });
  } catch (error) {
    console.error('[GET_PROGRAMS]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
