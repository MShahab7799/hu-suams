'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, Users, CalendarDays, BarChart3, Settings,
  TrendingUp, CheckCircle2, Clock, AlertTriangle, ArrowRight,
  Database, Activity, Volume2, Plus, Download, RefreshCw, Server
} from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    users: 482,
    students: 310,
    teachers: 82,
    officials: 35,
    appointments: 142,
    today: 18,
    pending: 9,
    approved: 124,
    completionRate: 91.2,
  });

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnDesc, setNewAnnDesc] = useState('');
  const [newAnnType, setNewAnnType] = useState('General');
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setAnnouncements([
      { id: '1', title: 'Midterm Exam Schedule Blockout', desc: 'All academic official slots are blocked for Exam supervision from July 20-25.', type: 'Emergency', time: '2 hours ago' },
      { id: '2', title: 'SMTP Server Migrations Completed', desc: 'Email notifications are now dispatched through local HU campus gateway.', type: 'System', time: 'Yesterday' }
    ]);
  }, []);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnDesc) return;

    const ann = {
      id: 'ann-' + Math.random(),
      title: newAnnTitle,
      desc: newAnnDesc,
      type: newAnnType,
      time: 'Just now'
    };

    setAnnouncements([ann, ...announcements]);
    setNewAnnTitle('');
    setNewAnnDesc('');
    setMsg('Announcement published successfully!');
    setTimeout(() => setMsg(null), 3000);
  };

  const adminSections = [
    { icon: '👥', label: 'User Management', desc: 'Manage role permissions, suspend/activate users, password resets', href: '/admin/users', color: '#3B82F6' },
    { icon: '🏛️', label: 'Faculties & Depts', desc: 'Manage departments, BS programs, and assign chairmans/HODs', href: '/admin/faculties', color: '#EC4899' },
    { icon: '📅', label: 'Appointments Queue', desc: 'Global review of all appointments requested across officials', href: '/admin/appointments', color: '#8B5CF6' },
    { icon: '📊', label: 'System Analytics', desc: 'Hourly traffic stats, department load charts, completion rates', href: '/admin/analytics', color: '#22C55E' },
    { icon: '🔒', label: 'Audit Logs', desc: 'Comprehensive track of every user action and auth logins', href: '/admin/audit', color: '#EF4444' },
    { icon: '⚙️', label: 'Settings & Backups', desc: 'Email gateways, SMS configs, logo assets, SQL dumps', href: '/admin/settings', color: '#F59E0B' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} style={{ color: '#EF4444' }} />
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">System Administrator</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Admin Control Panel
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Hazara University SUAMS Portal · Complete System Access
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Enrolled Users', value: stats.users, icon: Users, color: '#3B82F6', sub: `${stats.students} Students · ${stats.teachers} Teachers` },
          { label: 'Global Appointments', value: stats.appointments, icon: CalendarDays, color: '#8B5CF6', sub: `${stats.today} scheduled today` },
          { label: 'Pending Reviews', value: stats.pending, icon: Clock, color: '#F59E0B', sub: '9 actions required' },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: CheckCircle2, color: '#22C55E', sub: 'HU benchmark: 85%' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-5 rounded-2xl bg-black/20 border border-white/5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: s.color }} />
              <div>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div className="text-2xl font-bold text-white leading-none mb-1">{s.value}</div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
              <div className="text-[10px] text-zinc-500 mt-3 border-t border-white/5 pt-2">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Executive System Metrics */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Executive System Metrics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Total Users', val: 482, color: '#3B82F6' },
          { label: 'Students', val: 310, color: '#1B4D3E' },
          { label: 'Teachers', val: 82, color: '#0EA5E9' },
          { label: 'Parents', val: 45, color: '#14B8A6' },
          { label: 'Visitors', val: 30, color: '#6B7280' },
          { label: 'Alumni', val: 15, color: '#C5A028' },
          { label: 'Officials', val: 35, color: '#8B5CF6' },
          { label: 'Departments', val: 18, color: '#F59E0B' },
          { label: 'Faculties', val: 4, color: '#EC4899' },
          { label: 'Programs', val: 33, color: '#10B981' },
          { label: 'Appointments', val: 142, color: '#8B5CF6' },
          { label: 'Today\'s Visits', val: 18, color: '#3B82F6' },
          { label: 'Pending Requests', val: 9, color: '#F59E0B' },
          { label: 'Approved Visits', val: 124, color: '#22C55E' },
          { label: 'Rejected Requests', val: 6, color: '#EF4444' },
          { label: 'Completed Visits', val: 110, color: '#22C55E' },
          { label: 'Cancelled Visits', val: 2, color: '#EF4444' },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-xl bg-black/15 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-0.5" style={{ background: item.color }} />
            <div className="text-[10px] uppercase font-bold tracking-wide text-zinc-500 mb-1 truncate">{item.label}</div>
            <div className="text-lg font-bold text-white font-mono">{item.val}</div>
          </div>
        ))}
      </div>

      {/* Management Grid */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Core Administration Panels</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {adminSections.map((s) => (
          <Link href={s.href} key={s.label}>
            <div className="p-5 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/5 transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-sm text-white mb-1">{s.label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
              <div className="text-[10px] text-amber-500 font-bold mt-4 flex items-center gap-1">Open panel <ArrowRight size={10} /></div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Left 2 Columns: Announcement Creator */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-1.5">
              <Volume2 size={14} className="text-amber-500" /> Broadcast System Announcements
            </h3>
            <form onSubmit={handleCreateAnnouncement} className="flex flex-col gap-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-zinc-400">Heading Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter announcement title"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-zinc-400">Notice Category</label>
                  <select
                    value={newAnnType}
                    onChange={(e) => setNewAnnType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white"
                  >
                    <option>General</option>
                    <option>Emergency</option>
                    <option>System</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-zinc-400">Announcement Details *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details to show on user dashboard..."
                  value={newAnnDesc}
                  onChange={(e) => setNewAnnDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white resize-none"
                />
              </div>

              {msg && (
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-[11px] text-emerald-300">
                  {msg}
                </div>
              )}

              <button
                type="submit"
                className="py-2.5 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-1 mt-2"
              >
                <Plus size={14} /> Publish Announcement
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: System Health & Backup controls */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-white pb-2 border-b border-white/5 flex items-center gap-1.5">
              <Server size={14} className="text-amber-500" /> System Health
            </h3>
            <div className="flex flex-col gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between items-center">
                <span>Database Connectivity</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>SMTP Mail Delivery</span>
                <span className="text-emerald-400 font-semibold">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span>SMS Notification Gateway</span>
                <span className="text-amber-400 font-semibold">Idle</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Backup Daemon</span>
                <span className="text-emerald-400 font-semibold">Running</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
