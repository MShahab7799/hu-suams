'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Clock, CheckCircle2, XCircle, TrendingUp,
  User, Bell, ArrowRight, ShieldCheck, PieChart, Activity,
  Search, Filter, Sliders, Calendar as CalendarIcon, FileText,
  Mail, Phone, ExternalLink, RefreshCw, Send, CheckSquare
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn, getInitials, getStatusColor } from '@/lib/utils';
import type { UserRole } from '@/types';

export default function OfficialDashboardPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    today: 3,
    pending: 4,
    completed: 12,
    cancelled: 2,
  });
  const [activities, setActivities] = useState<any[]>([]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal / Detailed view states
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Reschedule' | 'Forward' | 'Complete' | null>(null);

  // Form states for workflow
  const [rejectionReason, setRejectionReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [forwardOfficial, setForwardOfficial] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [meetingSummary, setMeetingSummary] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);

  useEffect(() => {
    // Mock appointments data specifically targeted for the official
    const mockAppts = [
      {
        id: '1',
        appointmentNo: 'APT-2026-0101',
        bookedBy: { fullName: 'Zahid Mahmood', role: 'Student', email: 'zahid@hu.edu.pk', mobileNumber: '+92 300 1234567', universityId: '2023-CS-123' },
        purpose: 'NOC signature for foreign internship',
        notes: 'Needs signature on HEC internship form.',
        priority: 'High',
        appointmentDate: '2026-07-14',
        startTime: '09:00',
        endTime: '09:20',
        status: 'Approved',
        category: 'Student',
        faculty: 'Natural & Computational Sciences',
        department: 'Computer Science',
      },
      {
        id: '2',
        appointmentNo: 'APT-2026-0102',
        bookedBy: { fullName: 'Dr. Asif Khan', role: 'Teacher', email: 'asif@hu.edu.pk', mobileNumber: '+92 312 9876543', universityId: 'FAC-881' },
        purpose: 'Research Endorsement approval',
        notes: 'Endorsement signature on grant files.',
        priority: 'Medium',
        appointmentDate: '2026-07-14',
        startTime: '10:00',
        endTime: '10:30',
        status: 'Pending',
        category: 'Teacher',
        faculty: 'Biological & Health Sciences',
        department: 'Biotechnology',
      },
      {
        id: '3',
        appointmentNo: 'APT-2026-0103',
        bookedBy: { fullName: 'Kamran Shah', role: 'Alumni', email: 'kamran@gmail.com', mobileNumber: '+92 333 4455667', universityId: '2019-CS-99' },
        purpose: 'Transcript Correction Request',
        notes: 'Errors in semester 4 CGPA details.',
        priority: 'High',
        appointmentDate: '2026-07-14',
        startTime: '11:30',
        endTime: '11:50',
        status: 'Approved',
        category: 'Alumni',
        faculty: 'Natural & Computational Sciences',
        department: 'Software Engineering',
      }
    ];

    setAppointments(mockAppts);

    setActivities([
      { id: 'a1', desc: 'Approved Intern NOC request from Zahid Mahmood', time: '10 mins ago' },
      { id: 'a2', desc: 'Requested rescheduling for Saira Bibi late appeal', time: '40 mins ago' }
    ]);
  }, []);

  const name = session?.user?.name ?? 'Official';
  const role = (session?.user as any)?.role ?? 'Official';

  // Format display role labels
  const roleDisplayName = role === 'ViceChancellor' ? 'Vice Chancellor'
    : role === 'Registrar' ? 'Registrar'
    : role === 'Dean' ? 'Dean of Faculty'
    : role === 'Chairman' ? 'Chairman'
    : role === 'HOD' ? 'Head of Department (HOD)'
    : role === 'DirectorAdmissions' ? 'Director Admissions'
    : role === 'ControllerOfExaminations' ? 'Controller of Examinations'
    : role;

  const filteredAppts = appointments.filter((a) => {
    const matchesSearch =
      a.appointmentNo.toLowerCase().includes(search.toLowerCase()) ||
      a.bookedBy.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.purpose.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || a.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleActionSubmit = (status: string) => {
    const updated = appointments.map((a) => {
      if (a.id === selectedApt.id) {
        return {
          ...a,
          status,
          rejectionReason: status === 'Rejected' ? rejectionReason : null,
          rescheduleReason: status === 'Rescheduled' ? `Rescheduled proposal: ${rescheduleDate} at ${rescheduleTime}` : null,
          privateNotes,
          meetingSummary,
          isConfidential,
        };
      }
      return a;
    });

    setAppointments(updated);
    setDetailOpen(false);
    setActionType(null);
  };

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
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">Hazara University Official Secretariat</span>
          <h1 className="text-3xl font-bold font-display mt-2 text-white">Welcome, {roleDisplayName}</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Logged In: **{name}** · Active Schedule Desk
          </p>
        </div>
        <Link
          href="/official/timeslots"
          className="px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          Manage Time Slots <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today's Schedule", value: stats.today, icon: CalendarDays, color: '#3B82F6' },
          { label: 'Pending Approvals', value: stats.pending, icon: Clock, color: '#F59E0B' },
          { label: 'Completed Visits', value: stats.completed, icon: CheckCircle2, color: '#22C55E' },
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

      {/* Search & filters toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            type="search"
            placeholder="Search by ID or applicant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border border-[var(--border)] bg-black/25 text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-black/25 text-xs text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-black/25 text-xs text-white"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Calendar timeline & List grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Schedule timeline queue */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white p-5 border-b border-white/5 bg-black/20">
              Today's Schedule Timeline
            </h3>

            <div className="p-5 flex flex-col gap-4">
              {filteredAppts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => { setSelectedApt(a); setDetailOpen(true); }}
                  className="p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-amber-400 font-mono leading-none">{a.startTime}</span>
                      <span className="text-[8px] text-zinc-500 mt-1 uppercase">Start</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{a.bookedBy.fullName} ({a.category})</div>
                      <div className="text-[11px] truncate max-w-[280px]" style={{ color: 'var(--text-secondary)' }}>{a.purpose}</div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase', getStatusColor(a.status))}>
                      {a.status}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${a.priority === 'High' ? 'text-red-400 bg-red-500/5' : 'text-amber-400 bg-amber-500/5'}`}>
                      {a.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
              {filteredAppts.length === 0 && (
                <div className="py-10 text-center text-xs text-zinc-500">
                  No appointments match filters today.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mini calendar and statistics overview */}
        <div className="flex flex-col gap-6">
          {/* Action Log / Recent Activity */}
          <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
            <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-1.5">
              <Activity size={14} className="text-amber-400" /> Recent Desk Activity
            </h3>
            <div className="flex flex-col gap-4">
              {activities.map((act) => (
                <div key={act.id} className="text-xs">
                  <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed mb-0.5">{act.desc}</p>
                  <span className="text-[9px] text-zinc-500">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Popup */}
      <AnimatePresence>
        {detailOpen && selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden border border-[var(--border)] flex flex-col my-8">
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/30">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{selectedApt.appointmentNo}</span>
                  <h3 className="font-bold text-base text-white">Review Meeting Request</h3>
                </div>
                <button onClick={() => { setDetailOpen(false); setActionType(null); }} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[65vh]">
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Applicant</span>
                    <span className="font-bold text-white text-sm">{selectedApt.bookedBy.fullName}</span>
                    <span className="text-[10px] text-zinc-500 block">Category: {selectedApt.bookedBy.role}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Date & Time</span>
                    <span className="font-bold text-white font-mono text-sm">{selectedApt.appointmentDate}</span>
                    <span className="text-[10px] text-amber-400 font-mono block">Hour: {selectedApt.startTime} – {selectedApt.endTime}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Department</span>
                    <span className="font-semibold text-white">{selectedApt.department}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Status</span>
                    <span className={cn('px-2 py-0.5 rounded text-[9px] font-bold border uppercase inline-block mt-0.5', getStatusColor(selectedApt.status))}>{selectedApt.status}</span>
                  </div>
                </div>

                {/* Subject and reason */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs">
                  <span className="text-zinc-400 block mb-1 uppercase font-bold">Meeting Topic</span>
                  <p className="text-sm font-semibold text-white mb-2">{selectedApt.purpose}</p>
                  <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">{selectedApt.notes}</p>
                </div>

                {/* Official Actions Form */}
                {actionType === null ? (
                  <div className="flex flex-col gap-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Desk Operations</h5>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      <button onClick={() => setActionType('Approve')} className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">Approve Visit</button>
                      <button onClick={() => setActionType('Reschedule')} className="p-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white">Suggest Reschedule</button>
                      <button onClick={() => setActionType('Reject')} className="p-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white">Reject Request</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold mt-1">
                      <button onClick={() => handleActionSubmit('Completed')} className="p-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white">Mark Completed</button>
                      <button onClick={() => setActionType('Forward')} className="p-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white">Forward / Delegate</button>
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-white/10 bg-black/45 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">{actionType} Form</h5>
                      <button onClick={() => setActionType(null)} className="text-xs text-zinc-400 hover:text-white">Cancel</button>
                    </div>

                    {actionType === 'Reject' && (
                      <div>
                        <label className="block text-xs font-semibold uppercase mb-2 text-zinc-400">Rejection Reason</label>
                        <textarea rows={2} placeholder="Explain why the visit is rejected..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white text-xs resize-none" />
                      </div>
                    )}

                    {actionType === 'Reschedule' && (
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Suggested Date</label>
                          <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                        </div>
                        <div>
                          <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Suggested Time</label>
                          <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                        </div>
                      </div>
                    )}

                    {actionType === 'Forward' && (
                      <div>
                        <label className="block text-xs font-semibold uppercase mb-2 text-zinc-400">Delegate to Official</label>
                        <select value={forwardOfficial} onChange={(e) => setForwardOfficial(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white text-xs">
                          <option value="">Select official...</option>
                          <option value="registrar">Registrar Office</option>
                          <option value="dean">Dean of Faculty</option>
                        </select>
                      </div>
                    )}

                    {/* Private Notes & Confidential Options */}
                    <div className="grid grid-cols-1 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold mb-1 text-zinc-400">Private Note (Private to Official)</label>
                        <input type="text" placeholder="Write private reminder..." value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-zinc-400">Meeting Summary (Follow-up Remarks)</label>
                        <input type="text" placeholder="Summary notes after meeting..." value={meetingSummary} onChange={(e) => setMeetingSummary(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <input type="checkbox" id="chk-confidential" checked={isConfidential} onChange={(e) => setIsConfidential(e.target.checked)} className="w-4 h-4" />
                      <label htmlFor="chk-confidential" className="text-xs text-red-400 font-semibold cursor-pointer">Mark as Confidential Meeting</label>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setActionType(null)} className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-xs font-semibold">Back</button>
                      <button
                        onClick={() => handleActionSubmit(actionType === 'Approve' ? 'Approved' : actionType === 'Reject' ? 'Rejected' : actionType === 'Reschedule' ? 'Rescheduled' : 'Forwarded')}
                        className="px-5 py-2 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400"
                      >
                        Confirm Workflow Dispatch
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/10 flex justify-end gap-2 bg-black/20">
                <button onClick={() => { setDetailOpen(false); setActionType(null); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-white">Close Details</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
