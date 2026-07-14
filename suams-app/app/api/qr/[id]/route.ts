import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB } from '@/lib/db';
import QRCode from 'qrcode';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const appointment = await executeDB(
      async () => {
        return await prisma.appointment.findUnique({
          where: { id },
          include: {
            official: {
              include: {
                user: { select: { fullName: true } },
              },
            },
            bookedBy: {
              select: { fullName: true },
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
            user: { fullName: official?.user?.fullName || 'Official' }
          },
          bookedBy: {
            fullName: bookedBy?.fullName || 'Student'
          }
        };
      }
    );

    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }

    // Format QR code content
    const qrPayload = JSON.stringify({
      id: appointment.id,
      no: appointment.appointmentNo,
      applicant: appointment.bookedBy.fullName,
      official: appointment.official.user.fullName,
      date: new Date(appointment.appointmentDate).toISOString().split('T')[0],
      time: `${appointment.startTime} - ${appointment.endTime}`,
      status: appointment.status,
    });

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(qrPayload, {
      type: 'png',
      width: 250,
      margin: 2,
    });

    return new NextResponse(new Uint8Array(qrBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[GET_QR_CODE]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
