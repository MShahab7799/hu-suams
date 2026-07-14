'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays, Clock, CheckCircle2, XCircle, TrendingUp,
  User, Bell, ArrowRight, ShieldCheck, PieChart, Activity
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getInitials } from '@/lib/utils';

export default function AssistantDashboardPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    approved: 0,
    cancelled: 0,
    completionRate: 85,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Populate mock appointments for the official's queue managed by the assistant
    const mockAppts = [
      { id: '1', appointmentNo: 'APT-2026-0081', bookedBy: { fullName: 'Zahid Mahmood', role: 'Student' }, purpose: 'Degree Verification Request', priority: 'High', appointmentDate: new Date().toISOString(), startTime: '10:00', endTime: '10:20', status: 'Pending' },
      { id: '2', appointmentNo: 'APT-2026-0082', bookedBy: { fullName: 'Dr. Asif Khan', role: 'Teacher' }, purpose: 'Research Grant Discussion', priority: 'Medium', appointmentDate: new Date().toISOString(), startTime: '11:00', endTime: '11:30', status: 'Approved' },
      { id: '3', appointmentNo: 'APT-2026-0083', bookedBy: { fullName: 'Saira Bibi', role: 'Parent' }, purpose: 'Semester Fee Extension Support', priority: 'Low', appointmentDate: new Date().toISOString(), startTime: '12:00', endTime: '12:15', status: 'Pending' },
      { id: '4', appointmentNo: 'APT-2026-0084', bookedBy: { fullName: 'Kamran Shah', role: 'Alumni' }, purpose: 'Transcript Correction Urgent', priority: 'High', appointmentDate: new Date().toISOString(), startTime: '12:30', endTime: '12:50', status: 'Cancelled' },
    ];
    setAppointments(mockAppts);

    setStats({
      today: 2,
      pending: 2,
      approved: 1,
      cancelled: 1,
      completionRate: 85,
    });

    setActivities([
      { id: 'a1', desc: 'Approved appointment request for Zahid Mahmood', time: '5 mins ago' },
      { id: 'a2', desc: 'Rescheduled appointment for Dr. Asif Khan to 11:00 AM', time: '20 mins ago' },
      { id: 'a3', desc: 'Rejected request from Kamran Shah due to missing verification files', time: '1 hour ago' }
    ]);
  }, []);

  const name = session?.user?.name ?? 'Assistant';

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Welcome Card */}
      <div
        className="p-6 md:p-8 rounded-3xl mb-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, var(--hu-primary-dark) 0%, rgba(27,77,62,0.6) 100%)',
          border: '1px solid rgba(197,160,40,0.2)'
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full filter blur-3xl pointer-events-none" />
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">Hazara University Secretary Desk</span>
          <h1 className="text-3xl font-bold font-display mt-2 text-white">Welcome, {name.split(' ')[0]} 👋</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Assigned Office: **Vice Chancellor\'s Secretariat** · Active Session
          </p>
        </div>
        <Link
          href="/assistant/appointments"
          className="px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          Manage Requests <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today's Meetings", value: stats.today, icon: CalendarDays, color: '#3B82F6' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: '#F59E0B' },
          { label: 'Approved Appointments', value: stats.approved, icon: CheckCircle2, color: '#22C55E' },
          { label: 'Cancelled Requests', value: stats.cancelled, icon: XCircle, color: '#EF4444' },
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

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Left 2 columns: Today's Meetings & Pending list */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Today's Meetings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Today's Meetings Queue</h2>
              <span className="text-xs text-amber-400 font-mono">Date: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col gap-3">
              {appointments.filter(a => a.status === 'Approved').map((a) => (
                <div key={a.id} className="p-4 rounded-2xl bg-black/25 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-xs font-bold text-amber-400">
                      {getInitials(a.bookedBy.fullName)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{a.bookedBy.fullName}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{a.purpose}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-amber-400">{a.startTime} – {a.endTime}</span>
                    <div className="text-[10px] text-zinc-500">Room 101, VC Block</div>
                  </div>
                </div>
              ))}
              {appointments.filter(a => a.status === 'Approved').length === 0 && (
                <div className="p-8 rounded-2xl bg-black/20 border border-white/5 text-center text-xs text-zinc-500">
                  No meetings scheduled for today.
                </div>
              )}
            </div>
          </div>

          {/* Analytics Chart Block */}
          <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <PieChart size={14} className="text-amber-400" /> Weekly Peak Appointment Hours
            </h3>
            {/* Visual vector representation of peak hours */}
            <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 relative">
              <div className="absolute left-0 right-0 top-1/2 border-t border-white/5 border-dashed" />
              {[
                { label: '09:00', val: 30 },
                { label: '10:00', val: 75 },
                { label: '11:00', val: 90 },
                { label: '12:00', val: 40 },
                { label: '13:00', val: 85 },
                { label: '14:00', val: 15 },
              ].map((item) => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 z-10">
                  <div className="w-full bg-gradient-to-t from-emerald-600 to-amber-500 rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${item.val}%` }} />
                  <span className="text-[10px] font-mono text-zinc-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Recent Activity + Statistics */}
        <div className="flex flex-col gap-6">

          {/* Assistant Overview */}
          <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
            <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-amber-400" /> Queue Dashboard
            </h3>
            <div className="flex flex-col gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between">
                <span>Peak Load Day</span>
                <span className="font-semibold text-white">Monday</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Waiting List Time</span>
                <span className="font-semibold text-white">15 Mins</span>
              </div>
              <div className="flex justify-between">
                <span>Direct VC Appointments</span>
                <span className="font-semibold text-white">5 Active</span>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="p-5 rounded-2xl bg-black/20 border border-white/5 flex-1 flex flex-col">
            <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-1.5">
              <Activity size={14} className="text-amber-400" /> Activity Log
            </h3>
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
              {activities.map((a) => (
                <div key={a.id} className="text-xs">
                  <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed mb-0.5">{a.desc}</p>
                  <span className="text-[9px] text-zinc-500">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
