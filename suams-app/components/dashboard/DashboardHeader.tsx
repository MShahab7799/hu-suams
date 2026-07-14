'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, ChevronDown, UserCircle, Settings, LogOut, Menu } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn, getInitials, getRoleDisplayName } from '@/lib/utils';
import { isAdminRole, isOfficialRole } from '@/lib/permissions';
import type { UserRole } from '@/types';

interface DashboardHeaderProps {
  user: { id: string; name: string; email: string; image: string | null; role: UserRole };
  onMobileMenuOpen?: () => void;
}

function getProfilePath(role: UserRole): string {
  if (isAdminRole(role)) return '/admin/settings';
  if (isOfficialRole(role) || role === 'Assistant') return '/official/profile';
  return '/student/profile';
}

function getSettingsPath(role: UserRole): string {
  if (isAdminRole(role)) return '/admin/settings';
  if (isOfficialRole(role) || role === 'Assistant') return '/official/profile';
  return '/student/profile';
}

export default function DashboardHeader({ user, onMobileMenuOpen }: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Appointment Approved', text: 'Your visit with Vice Chancellor Prof. Dr. Mohsin Khan is approved for Tuesday at 10:00 AM.', read: false },
    { id: 'n2', title: 'Schedule Update Alert', text: 'Mid-term blockout updates published by Admin desk.', read: false },
    { id: 'n3', title: 'Welcome to HU SUAMS', text: 'Registration completed. Start managing your calendar scheduling portal.', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAll = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const handleDeleteNotif = (id: string) => setNotifications(notifications.filter(n => n.id !== id));

  const roleLabel = getRoleDisplayName(user.role);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const profilePath = getProfilePath(user.role);
  const settingsPath = getSettingsPath(user.role);

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 md:px-6 h-16 flex-shrink-0"
      style={{
        background: 'rgba(8,14,18,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Left: Mobile hamburger + Greeting */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/8"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          aria-label="Open navigation menu"
        >
          <Menu size={16} />
        </button>

        <div className="hidden md:block">
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {greeting}, <span style={{ color: 'var(--hu-accent)' }}>{user.name.split(' ')[0]}</span> 👋
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden lg:flex flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            type="search"
            placeholder="Search appointments, officials..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/8"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            aria-label="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: 'var(--hu-accent)', color: '#000' }}>
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50 shadow-2xl"
                  style={{ background: 'var(--surface-2, var(--surface))', border: '1px solid var(--border)' }}
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
                    <span className="font-bold text-sm text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAll} className="text-xs font-bold transition-colors" style={{ color: 'var(--hu-accent)' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 p-3 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 rounded-xl relative group"
                        style={{
                          background: notif.read ? 'transparent' : 'rgba(197,160,40,0.06)',
                          border: `1px solid ${notif.read ? 'var(--border)' : 'rgba(197,160,40,0.2)'}`,
                        }}
                      >
                        {!notif.read && <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        <div className="font-semibold text-xs text-white mb-0.5 pr-4">{notif.title}</div>
                        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{notif.text}</p>
                        <button
                          onClick={() => handleDeleteNotif(notif.id)}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-xs transition-opacity"
                          style={{ color: 'var(--text-muted)' }}
                        >✕</button>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No notifications</div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff' }}
            >
              {user.image ? (
                <Image src={user.image} alt={user.name} width={28} height={28} className="rounded-lg" />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold leading-none mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {user.name.split(' ')[0]}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{roleLabel}</div>
            </div>
            <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} className={cn('transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50 shadow-2xl"
                  style={{ background: 'var(--surface-2, var(--surface))', border: '1px solid var(--border)' }}
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
                    <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
                    <div className="text-[10px] mt-1 font-semibold" style={{ color: 'var(--hu-accent)' }}>{roleLabel}</div>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon: UserCircle, label: 'My Profile', href: profilePath },
                    { icon: Settings, label: 'Settings', href: settingsPath },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-white/5"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Icon size={14} />
                        {item.label}
                      </Link>
                    );
                  })}

                  <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/login' }); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-all hover:bg-red-500/5"
                      style={{ color: '#FCA5A5' }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
