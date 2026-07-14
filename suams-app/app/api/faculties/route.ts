import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const faculties = await executeDB(
      async () => {
        return await prisma.faculty.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
        });
      },
      () => {
        const db = readLocalDB();
        return db.faculties || [
          { id: 'ncs', name: 'Faculty of Natural & Computational Sciences', shortName: 'NCS' },
          { id: 'bhs', name: 'Faculty of Biological & Health Sciences', shortName: 'BHS' },
          { id: 'lss', name: 'Faculty of Law & Social Sciences', shortName: 'LSS' },
          { id: 'ah', name: 'Faculty of Arts & Humanities', shortName: 'AH' }
        ];
      }
    );

    return NextResponse.json({ success: true, data: faculties });
  } catch (error) {
    console.error('[GET_FACULTIES]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
