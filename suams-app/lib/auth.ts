// ============================================================
//  NextAuth v5 (Auth.js) Configuration — SUAMS
// ============================================================

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { executeDB, readLocalDB, writeLocalDB } from '@/lib/db';
import { loginSchema } from '@/lib/validations';
import { authConfig } from './auth.config';
import type { UserRole } from '@/types';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        // Validate input shape
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Try DB first, fallback to JSON DB
        const user = await executeDB(
          async () => {
            return await prisma.user.findUnique({
              where: { email: email.toLowerCase() },
              select: {
                id: true,
                fullName: true,
                email: true,
                passwordHash: true,
                role: true,
                isActive: true,
                profilePicture: true,
                universityId: true,
              },
            });
          },
          async () => {
            const db = await readLocalDB();
            const found = db.users?.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
            if (!found) return null;
            return {
              id: found.id,
              fullName: found.fullName,
              email: found.email,
              passwordHash: found.passwordHash,
              role: found.role,
              isActive: found.isActive,
              profilePicture: found.profilePicture || null,
              universityId: found.universityId || null,
            };
          }
        );

        if (!user || !user.isActive) return null;

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        // Update last login (non-blocking)
        executeDB(
          async () => {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() },
            });
            await prisma.auditLog.create({
              data: {
                userId: user.id,
                action: 'Login',
                resource: 'auth',
                resourceId: user.id,
              },
            });
          },
          async () => {
            const db = await readLocalDB();
            const idx = db.users.findIndex((u: any) => u.id === user.id);
            if (idx !== -1) {
              db.users[idx].lastLoginAt = new Date().toISOString();
              db.auditLogs.push({
                id: 'audit-' + Math.random(),
                userId: user.id,
                action: 'Login',
                resource: 'auth',
                resourceId: user.id,
                createdAt: new Date().toISOString()
              });
              await writeLocalDB(db);
            }
          }
        ).catch(() => {});

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.profilePicture,
          role: user.role as UserRole,
        };
      },
    }),
  ],
});

