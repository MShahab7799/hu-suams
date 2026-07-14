import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/types';
import DashboardShell from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = {
    id: (session.user as any).id as string,
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    image: session.user.image ?? null,
    role: (session.user as any).role as UserRole,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
