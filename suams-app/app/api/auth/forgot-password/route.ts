// ============================================================
//  Forgot Password API — POST /api/auth/forgot-password
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 422 }
      );
    }

    const { email } = parsed.data;

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, fullName: true, email: true },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });

      // In production: send email with reset link
      // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
      // await sendEmail({ to: user.email, subject: 'Reset Password', ... });

      console.log(`[FORGOT_PASSWORD] Reset token for ${email}: ${resetToken}`);
    }

    return NextResponse.json({
      success: true,
      message:
        'If an account with that email exists, we sent a password reset link.',
    });
  } catch (error) {
    console.error('[FORGOT_PASSWORD]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
