'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CalendarDays, Clock, CheckCircle2, TrendingUp, Plus, ArrowRight,
  User, Mail, Phone, Bell, Shield, BookOpen, HelpCircle
} from 'lucide-react';
import { getInitials, getStatusColor } from '@/lib/utils';
import { useSession } from 'next-auth/react';

// Quick Action Card Component
function QuickAction({ icon, label, desc, href, color }: { icon: string; label: string; desc: string; href: string; color: string }) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="p-4 rounded-2xl flex items-center gap-4 transition-all cursor-pointer group bg-black/20 border border-white/5 hover:border-white/10"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</div>
        </div>
        <ArrowRight size={14} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all text-amber-400 translate-x-[-4px] group-hover:translate-x-0" />
      </motion.div>
    </Link>
  );
}

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    if (session?.user) {
      // Fetch user's appointments and notifications
      Promise.all([
        fetch('/api/appointments'),
        fetch('/api/officials?available=true') // Fetch some notifications/officials
      ])
        .then(async ([res1, res2]) => {
          const json1 = await res1.json();
          if (json1.success) {
            const list = json1.data;
            setAppointments(list);

            const pending = list.filter((a: any) => a.status === 'Pending').length;
            const approved = list.filter((a: any) => a.status === 'Approved' || a.status === 'Rescheduled').length;
            const completed = list.filter((a: any) => a.status === 'Completed').length;

            setStats({
              total: list.length,
              upcoming: approved,
              completed: completed,
              pending: pending
            });
          }

          // Setup mock / loaded notifications
          setNotifications([
            { id: 'n1', title: 'Welcome to SUAMS!', message: 'You have successfully signed in to the Smart University Appointment Management System.', time: 'Just now' },
            { id: 'n2', title: 'IT Directorate Notice', message: 'Please ensure your profile is up to date before booking appointments.', time: '1 hour ago' }
          ]);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const name = session?.user?.name ?? 'Student';
  const email = session?.user?.email ?? 'student@hu.edu.pk';
  const role = (session?.user as any)?.role ?? 'Student';

  // Find next upcoming appointment (approved or rescheduled)
  const upcomingApt = appointments.find((a: any) => a.status === 'Approved' || a.status === 'Rescheduled');

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* ── Welcome Card ────────────────────────────────────── */}
      <div
        className="p-6 md:p-8 rounded-3xl mb-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, var(--hu-primary-dark) 0%, rgba(27,77,62,0.6) 100%)',
          border: '1px solid rgba(197,160,40,0.2)'
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full filter blur-3xl pointer-events-none" />
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">Hazara University Portal</span>
          <h1 className="text-3xl font-bold font-display mt-2 text-white">Welcome back, {name.split(' ')[0]}!</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Hazara University Smart Appointment Management System (SUAMS)
          </p>
        </div>
        <Link
          href="/appointments"
          className="px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <Plus size={16} /> Book Appointment
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Left 2 Columns: Stats + Upcoming + Quick Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* ── Appointment Statistics ───────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Visits', value: stats.total, icon: CalendarDays, color: '#3B82F6' },
              { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: '#F59E0B' },
              { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: '#22C55E' },
              { label: 'Pending', value: stats.pending, icon: TrendingUp, color: '#8B5CF6' }
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="p-4 rounded-2xl bg-black/20 border border-white/5 flex flex-col">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                    <Icon size={16} style={{ color: s.color }} />
                  </div>
                  <span className="text-2xl font-bold text-white leading-none">{s.value}</span>
                  <span className="text-[11px] mt-2" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* ── Upcoming Appointment ─────────────────────────── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Upcoming Appointment</h2>
            {upcomingApt ? (
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs font-bold text-amber-400 font-mono mb-1">{upcomingApt.appointmentNo}</div>
                  <div className="font-semibold text-white text-sm">{upcomingApt.official?.user?.fullName || 'Official'}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{upcomingApt.official?.title}</div>
                  <div className="text-xs mt-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <span>📅</span> <span>{new Date(upcomingApt.appointmentDate).toDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>⏰</span> <span>{upcomingApt.startTime} – {upcomingApt.endTime}</span>
                  </div>
                </div>
                <Link
                  href="/student/appointments"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all"
                >
                  View Details
                </Link>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-black/20 border border-white/5 text-center">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No upcoming appointments scheduled.</p>
              </div>
            )}
          </div>

          {/* ── Quick Actions ────────────────────────────────── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Quick Actions</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <QuickAction icon="📅" label="Book Appointment" desc="Schedule with any official" href="/appointments" color="#C5A028" />
              <QuickAction icon="👥" label="My Appointments" desc="Track and update visits" href="/student/appointments" color="#3B82F6" />
              <QuickAction icon="👤" label="My Profile" desc="Edit contact info" href="/student/profile" color="#22C55E" />
              <QuickAction icon="❓" label="Help Center" desc="Guides and support" href="mailto:support@hu.edu.pk" color="#EC4899" />
            </div>
          </div>

        </div>

        {/* Right Column: Profile Summary + Notifications */}
        <div className="flex flex-col gap-6">

          {/* ── User Profile Summary ─────────────────────────── */}
          <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg bg-amber-500 text-black">
                {getInitials(name)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{name}</h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase border border-amber-500/20 inline-block mt-0.5">
                  {role}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs border-t border-white/5 pt-4" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <Mail size={13} /> <span>{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} /> <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={13} /> <span>Verified Student</span>
              </div>
            </div>
          </div>

          {/* ── Notifications ────────────────────────────────── */}
          <div className="p-5 rounded-2xl bg-black/20 border border-white/5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <h3 className="font-bold text-xs uppercase tracking-widest text-white flex items-center gap-1.5">
                <Bell size={13} className="text-amber-400" /> Notifications
              </h3>
              <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">2</span>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[220px]">
              {notifications.map((n) => (
                <div key={n.id} className="text-xs">
                  <div className="font-semibold text-white mb-0.5">{n.title}</div>
                  <p style={{ color: 'var(--text-secondary)' }} className="leading-normal mb-1">{n.message}</p>
                  <span className="text-[10px] text-zinc-500">{n.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
