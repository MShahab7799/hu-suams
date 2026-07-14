// ============================================================
//  Officials API — GET /api/officials
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB } from '@/lib/db';
import { paginationSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const { page, limit, search } = paginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
    });

    const facultyId = searchParams.get('facultyId');
    const departmentId = searchParams.get('departmentId');
    const available = searchParams.get('available');
    const role = searchParams.get('role');

    const where: any = {};
    if (available === 'true') where.isAvailable = true;
    if (facultyId) where.facultyId = facultyId;
    if (departmentId) where.departmentId = departmentId;
    if (role) where.user = { role };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { user: { fullName: { contains: search } } },
        { officeLocation: { contains: search } },
      ];
    }

    const result = await executeDB(
      async () => {
        const [officials, total] = await Promise.all([
          prisma.official.findMany({
            where,
            include: {
              user: {
                select: {
                  id: true, fullName: true, email: true,
                  mobileNumber: true, profilePicture: true, role: true,
                },
              },
              faculty: { select: { id: true, name: true, shortName: true } },
              department: { select: { id: true, name: true, shortName: true } },
              timeSlots: { where: { isActive: true } },
              _count: {
                select: { appointments: { where: { status: { notIn: ['Cancelled', 'Rejected'] } } } },
              },
            },
            orderBy: { user: { fullName: 'asc' } },
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.official.count({ where }),
        ]);
        return { officials, total };
      },
      () => {
        const db = readLocalDB();
        let list = db.officials || [];

        // Apply filters
        if (available === 'true') list = list.filter((o: any) => o.isAvailable);
        if (search) {
          list = list.filter((o: any) =>
            o.title.toLowerCase().includes(search.toLowerCase()) ||
            o.user?.fullName.toLowerCase().includes(search.toLowerCase())
          );
        }

        const total = list.length;
        const paginated = list.slice((page - 1) * limit, page * limit);
        return { officials: paginated, total };
      }
    );

    const totalPages = Math.ceil(result.total / limit);

    return NextResponse.json({
      success: true,
      data: result.officials,
      meta: { page, limit, total: result.total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (error) {
    console.error('[GET_OFFICIALS]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
