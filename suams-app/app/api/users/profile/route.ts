import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { executeDB, readLocalDB, writeLocalDB } from '@/lib/db';
import { updateProfileSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string;

    const user = await executeDB(
      async () => {
        return await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            fullName: true,
            email: true,
            universityId: true,
            cnic: true,
            mobileNumber: true,
            gender: true,
            semester: true,
            role: true,
            isActive: true,
            profilePicture: true,
            createdAt: true,
          },
        });
      },
      async () => {
        const db = await readLocalDB();
        const found = db.users?.find((u: any) => u.id === userId);
        if (!found) return null;
        return {
          id: found.id,
          fullName: found.fullName,
          email: found.email,
          universityId: found.universityId || null,
          cnic: found.cnic || null,
          mobileNumber: found.mobileNumber || null,
          gender: found.gender || null,
          semester: found.semester || null,
          role: found.role,
          isActive: found.isActive,
          profilePicture: found.profilePicture || null,
          createdAt: found.createdAt || new Date().toISOString(),
        };
      }
    );

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('[GET_PROFILE]', error);
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

    // Check if we are doing a password change request
    let passwordHashUpdate: string | undefined = undefined;
    if (body.currentPassword && body.newPassword) {
      if (body.newPassword.length < 8) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 8 characters long' },
          { status: 400 }
        );
      }

      // Fetch user's current password hash
      const currentPassHash = await executeDB(
        async () => {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
          });
          return user?.passwordHash;
        },
        async () => {
          const db = await readLocalDB();
          const user = db.users?.find((u: any) => u.id === userId);
          return user?.passwordHash;
        }
      );

      if (!currentPassHash) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(body.currentPassword, currentPassHash);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 400 });
      }

      // Hash new password
      passwordHashUpdate = await bcrypt.hash(body.newPassword, 12);
    }

    // Now validate other fields using updateProfileSchema
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const updateData: any = { ...parsed.data };
    if (passwordHashUpdate) {
      updateData.passwordHash = passwordHashUpdate;
    }

    const updatedUser = await executeDB(
      async () => {
        return await prisma.user.update({
          where: { id: userId },
          data: updateData,
          select: {
            id: true,
            fullName: true,
            email: true,
            universityId: true,
            cnic: true,
            mobileNumber: true,
            gender: true,
            semester: true,
            role: true,
            isActive: true,
            profilePicture: true,
            createdAt: true,
          },
        });
      },
      async () => {
        const db = await readLocalDB();
        const idx = db.users?.findIndex((u: any) => u.id === userId);
        if (idx === -1 || idx === undefined) {
          throw new Error('User not found');
        }

        const current = db.users[idx];
        const updated = {
          ...current,
          ...updateData,
        };
        db.users[idx] = updated;
        await writeLocalDB(db);

        return {
          id: updated.id,
          fullName: updated.fullName,
          email: updated.email,
          universityId: updated.universityId || null,
          cnic: updated.cnic || null,
          mobileNumber: updated.mobileNumber || null,
          gender: updated.gender || null,
          semester: updated.semester || null,
          role: updated.role,
          isActive: updated.isActive,
          profilePicture: updated.profilePicture || null,
          createdAt: updated.createdAt || new Date().toISOString(),
        };
      }
    );

    return NextResponse.json({ success: true, data: updatedUser, message: 'Profile updated successfully' });
  } catch (error: any) {
    console.error('[PATCH_PROFILE]', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
