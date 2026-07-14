// ============================================================
//  Reset Password API — POST /api/auth/reset-password
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB, writeLocalDB } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { token, password } = parsed.data;

    const result = await executeDB(
      async () => {
        const user = await prisma.user.findFirst({
          where: {
            resetToken: token,
            resetTokenExpiry: { gte: new Date() },
          },
        });

        if (!user) {
          throw new Error('Invalid or expired reset token');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            passwordHash,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });

        return { success: true };
      },
      async () => {
        const db = await readLocalDB();
        db.users = db.users || [];
        const idx = db.users.findIndex((u: any) =>
          u.resetToken === token &&
          u.resetTokenExpiry &&
          new Date(u.resetTokenExpiry).getTime() >= Date.now()
        );

        if (idx === -1) {
          throw new Error('Invalid or expired reset token');
        }

        const passwordHash = await bcrypt.hash(password, 12);
        db.users[idx].passwordHash = passwordHash;
        db.users[idx].resetToken = null;
        db.users[idx].resetTokenExpiry = null;
        await writeLocalDB(db);

        return { success: true };
      }
    );

    return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error('[RESET_PASSWORD]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
