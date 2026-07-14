// ============================================================
//  Route Protection Middleware — SUAMS
// ============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { getDashboardPath, hasRouteAccess, PUBLIC_ROUTES } from '@/lib/permissions';
import type { UserRole } from '@/types';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req as NextRequest & { auth: any };
  const pathname = nextUrl.pathname;

  // Allow public routes and API auth routes
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isApiRoute = pathname.startsWith('/api/');
  const isStaticRoute =
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/uploads/');

  if (isStaticRoute) return NextResponse.next();
  if (isApiRoute && !pathname.startsWith('/api/auth')) return NextResponse.next();

  // Not authenticated → redirect to login
  if (!session?.user && !isPublicRoute) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user on public auth pages → redirect to dashboard
  if (session?.user && (pathname === '/login' || pathname === '/register')) {
    const role = (session.user as any).role as UserRole;
    const dashboardPath = getDashboardPath(role);
    return NextResponse.redirect(new URL(dashboardPath, nextUrl.origin));
  }

  // Role-based route protection
  if (session?.user) {
    const role = (session.user as any).role as UserRole;
    const hasAccess = hasRouteAccess(role, pathname);

    if (!hasAccess) {
      // Redirect to their authorized dashboard
      const dashboardPath = getDashboardPath(role);
      return NextResponse.redirect(new URL(dashboardPath, nextUrl.origin));
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
