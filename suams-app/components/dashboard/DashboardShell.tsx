'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import type { UserRole } from '@/types';

interface DashboardShellProps {
  user: { id: string; name: string; email: string; image: string | null; role: UserRole };
  children: React.ReactNode;
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <DashboardSidebar
        user={user}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          user={user}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          style={{ background: 'var(--bg)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
