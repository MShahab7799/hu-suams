'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, CalendarDays, Users, Settings, Bell,
  LogOut, UserCircle, Clock, BookOpen,
  BarChart3, FileText, Home, HelpCircle, Building, X, ChevronRight
} from 'lucide-react';
import { cn, getInitials, getRoleDisplayName } from '@/lib/utils';
import { getRoleIcon, isAdminRole, isOfficialRole } from '@/lib/permissions';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: number;
}

function getNavItems(role: UserRole): { section: string; items: NavItem[] }[] {
  if (isAdminRole(role)) {
    return [
      { section: 'Administration', items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Appointments', href: '/admin/appointments', icon: CalendarDays },
        { label: 'Faculties', href: '/admin/faculties', icon: Building },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ]},
      { section: 'Reports', items: [
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { label: 'Audit Logs', href: '/admin/audit', icon: FileText },
      ]},
    ];
  }

  if (role === 'Assistant') {
    return [
      { section: 'Assistant Hub', items: [
        { label: 'Overview', href: '/assistant', icon: LayoutDashboard },
        { label: 'Requests', href: '/assistant/appointments', icon: CalendarDays },
        { label: 'Time Slots', href: '/assistant/schedule', icon: Clock },
        { label: 'Calendar View', href: '/assistant/calendar', icon: CalendarDays },
      ]},
      { section: 'Analytics', items: [
        { label: 'Reports', href: '/assistant/reports', icon: BarChart3 },
      ]},
    ];
  }

  if (isOfficialRole(role)) {
    return [
      { section: 'Official Desk', items: [
        { label: 'Overview', href: '/official', icon: LayoutDashboard },
        { label: 'Appointments', href: '/official/appointments', icon: CalendarDays },
        { label: 'Time Slots', href: '/official/timeslots', icon: Clock },
        { label: 'Calendar View', href: '/official/calendar', icon: CalendarDays },
      ]},
      { section: 'Reports & Profile', items: [
        { label: 'Reports', href: '/official/reports', icon: BarChart3 },
        { label: 'My Profile', href: '/official/profile', icon: UserCircle },
      ]},
    ];
  }

  // Student / Alumni / Teacher / Parent / Visitor
  return [
    { section: 'Main', items: [
      { label: 'Overview', href: '/student', icon: LayoutDashboard },
      { label: 'My Appointments', href: '/student/appointments', icon: CalendarDays },
      { label: 'Book Appointment', href: '/appointments', icon: BookOpen },
      { label: 'Help Center', href: '/student/help-center', icon: HelpCircle },
    ]},
    { section: 'Account', items: [
      { label: 'My Profile', href: '/student/profile', icon: UserCircle },
    ]},
  ];
}

interface SidebarProps {
  user: { id: string; name: string; email: string; image: string | null; role: UserRole };
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ user, mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navGroups = getNavItems(user.role);
  const roleIcon = getRoleIcon(user.role);
  const roleLabel = getRoleDisplayName(user.role);

  const SidebarContent = () => (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-full overflow-y-auto"
      style={{ background: 'var(--bg-2)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '2px solid rgba(197,160,40,0.4)' }}>
            <Image src="/assets/logo.png" alt="HU" width={36} height={36} className="rounded-xl"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div>
            <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Hazara University</div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>SUAMS Portal</div>
          </div>
        </Link>
        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/8 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* User card */}
      <div className="p-4">
        <div
          className="p-3 rounded-xl flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(27,77,62,0.25), rgba(27,77,62,0.08))', border: '1px solid rgba(27,77,62,0.3)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff' }}
          >
            {user.image ? (
              <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-xl" />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
            <div className="text-[10px] flex items-center gap-1" style={{ color: 'var(--hu-accent)' }}>
              <span>{roleIcon}</span>
              <span className="truncate">{roleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.section} className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
              {group.section}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                // Active if exact match or sub-path (except root dashboard paths)
                const isActive = pathname === item.href ||
                  (item.href.length > 1 && pathname.startsWith(item.href + '/'));
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                      style={{
                        background: isActive ? 'rgba(27,77,62,0.35)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--hu-primary-light)' : '3px solid transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      }}
                    >
                      <Icon size={15} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <ChevronRight size={12} style={{ color: 'var(--hu-primary-light)' }} />}
                      {item.badge != null && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--hu-accent)', color: '#000' }}>
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Links */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all hover:bg-white/5 mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Home size={13} /> Back to Main Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs w-full text-left transition-all hover:bg-red-500/5"
          style={{ color: '#FCA5A5' }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:flex w-64 flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile sidebar — drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sidebar-overlay lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden"
              style={{ boxShadow: '4px 0 40px rgba(0,0,0,0.5)' }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
