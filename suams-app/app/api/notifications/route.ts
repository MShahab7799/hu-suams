import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB, writeLocalDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const { searchParams } = req.nextUrl;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await executeDB(
      async () => {
        return await prisma.notification.findMany({
          where: {
            userId,
            ...(unreadOnly ? { isRead: false } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });
      },
      async () => {
        const db = await readLocalDB();
        let list = db.notifications || [];
        list = list.filter((n: any) => n.userId === userId);
        if (unreadOnly) {
          list = list.filter((n: any) => !n.isRead);
        }
        // sort by createdAt desc
        list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return list;
      }
    );

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('[GET_NOTIFICATIONS]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const body = await req.json();
    const { notificationId, markAll } = body;

    const result = await executeDB(
      async () => {
        if (markAll) {
          await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
          });
          return { markedAll: true };
        } else if (notificationId) {
          const updated = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
          });
          return updated;
        } else {
          throw new Error('Invalid request payload');
        }
      },
      async () => {
        const db = await readLocalDB();
        db.notifications = db.notifications || [];
        if (markAll) {
          db.notifications.forEach((n: any) => {
            if (n.userId === userId) {
              n.isRead = true;
            }
          });
          await writeLocalDB(db);
          return { markedAll: true };
        } else if (notificationId) {
          const found = db.notifications.find((n: any) => n.id === notificationId);
          if (found) {
            found.isRead = true;
            await writeLocalDB(db);
            return found;
          }
          throw new Error('Notification not found');
        }
        throw new Error('Invalid request payload');
      }
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[PATCH_NOTIFICATIONS]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
