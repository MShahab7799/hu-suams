'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ArrowUpDown, Eye, CheckCircle2, XCircle, Clock,
  Calendar, Mail, Phone, FileText, ChevronLeft, ChevronRight, Sliders,
  MessageSquare, Building, ExternalLink, ShieldCheck, UserCheck
} from 'lucide-react';
import { cn, getStatusColor, getInitials } from '@/lib/utils';
import { useSession } from 'next-auth/react';

export default function OfficialAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Detail Modal State
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Workflow states
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | 'Reschedule' | 'Forward' | 'Complete' | null>(null);
  const [room, setRoom] = useState('Room 101, VC Block');
  const [meetingLink, setMeetingLink] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [forwardOfficial, setForwardOfficial] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [meetingSummary, setMeetingSummary] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);

  useEffect(() => {
    // Setup matching appointment requests
    const list = [
      {
        id: '1',
        appointmentNo: 'APT-2026-0101',
        bookedBy: { id: 'u1', fullName: 'Zahid Mahmood', role: 'Student', email: 'zahid@hu.edu.pk', mobileNumber: '+92 300 1234567', universityId: '2023-CS-123', cnic: '12345-1234567-1' },
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
        bookedBy: { id: 'u2', fullName: 'Dr. Asif Khan', role: 'Teacher', email: 'asif@hu.edu.pk', mobileNumber: '+92 312 9876543', universityId: 'FAC-881', cnic: '54321-7654321-2' },
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
        bookedBy: { id: 'u3', fullName: 'Kamran Shah', role: 'Alumni', email: 'kamran@gmail.com', mobileNumber: '+92 333 4455667', universityId: '2019-CS-99', cnic: '98765-4321098-3' },
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

    setAppointments(list);
    setLoading(false);
  }, []);

  const filteredAppointments = appointments.filter((a) => {
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
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            All Scheduled Appointments
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Search, review, and manage all appointment slots on your desk.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            type="search"
            placeholder="Search by ID or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border border-[var(--border)] bg-black/25 text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-black/25 text-xs text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
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

      {/* Requests table card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-[var(--border)]">
        {loading ? (
          <div className="py-20 text-center text-sm">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4">📥</div>
            <div className="font-bold text-white mb-2">No appointments found.</div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No matching schedules in this queue.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <th className="p-4">Appt. ID</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Faculty / Dept</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Schedule Date/Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm" style={{ borderColor: 'var(--border)' }}>
                {filteredAppointments.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">{a.appointmentNo}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{a.bookedBy.fullName}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{a.bookedBy.role}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{a.department}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{a.faculty}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${a.priority === 'High' ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'}`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{a.appointmentDate}</div>
                      <div className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>{a.startTime} – {a.endTime}</div>
                    </td>
                    <td className="p-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold border uppercase', getStatusColor(a.status))}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => { setSelectedApt(a); setDetailOpen(true); }}
                        className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 flex items-center gap-1 mx-auto"
                      >
                        <Eye size={13} /> View Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Request Modal with Workflow Operations */}
      <AnimatePresence>
        {detailOpen && selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden border border-[var(--border)] flex flex-col my-8">
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/30">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{selectedApt.appointmentNo}</span>
                  <h3 className="font-bold text-base text-white">Appointment Details</h3>
                </div>
                <button onClick={() => { setDetailOpen(false); setActionType(null); }} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
                {/* Applicant Summary */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-white/5 border border-white/5 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center text-lg flex-shrink-0">
                    {getInitials(selectedApt.bookedBy.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm">{selectedApt.bookedBy.fullName}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Role: {selectedApt.bookedBy.role} · CNIC: {selectedApt.bookedBy.cnic}</p>
                    {selectedApt.bookedBy.universityId && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 mt-1 inline-block">ID: {selectedApt.bookedBy.universityId}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-1.5"><Mail size={12} /> {selectedApt.bookedBy.email}</div>
                    <div className="flex items-center gap-1.5"><Phone size={12} /> {selectedApt.bookedBy.mobileNumber}</div>
                  </div>
                </div>

                {/* Reason Details */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider mb-2 text-zinc-400">Meeting Purpose</h5>
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                    <p className="text-sm font-semibold text-white mb-2">{selectedApt.purpose}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{selectedApt.notes || 'No notes provided.'}</p>
                  </div>
                </div>

                {/* Actions */}
                {actionType === null ? (
                  <div className="flex flex-col gap-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Desk Operations</h5>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => setActionType('Approve')} className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white">
                        ✓ Approve Request
                      </button>
                      <button onClick={() => setActionType('Reschedule')} className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white">
                        📅 Suggest Reschedule
                      </button>
                      <button onClick={() => setActionType('Reject')} className="p-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs text-white">
                        ✕ Reject Appointment
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold mt-1">
                      <button onClick={() => handleActionSubmit('Completed')} className="p-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white">Mark Completed</button>
                      <button onClick={() => setActionType('Forward')} className="p-2.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white">Forward / Delegate</button>
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-white/10 bg-black/40 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">{actionType} Form</h5>
                      <button onClick={() => setActionType(null)} className="text-xs text-zinc-400 hover:text-white">Cancel</button>
                    </div>

                    {actionType === 'Approve' && (
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Meeting Location / Room</label>
                          <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                        </div>
                        <div>
                          <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Online Meeting Link (Optional)</label>
                          <input type="text" placeholder="Teams / Zoom url" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                        </div>
                      </div>
                    )}

                    {actionType === 'Reject' && (
                      <div>
                        <label className="block text-xs font-semibold uppercase mb-2 text-zinc-400">Rejection Reason *</label>
                        <textarea rows={2} placeholder="Explain why the request is rejected..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white text-xs resize-none" />
                      </div>
                    )}

                    {actionType === 'Reschedule' && (
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Suggest Date</label>
                          <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                        </div>
                        <div>
                          <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Suggest Hour</label>
                          <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                        </div>
                      </div>
                    )}

                    {actionType === 'Forward' && (
                      <div>
                        <label className="block text-xs font-semibold uppercase mb-2 text-zinc-400">Forward to Official</label>
                        <select value={forwardOfficial} onChange={(e) => setForwardOfficial(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white text-xs">
                          <option value="">Select official...</option>
                          <option value="registrar">Registrar Office</option>
                          <option value="dean">Dean of Faculty</option>
                        </select>
                      </div>
                    )}

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
