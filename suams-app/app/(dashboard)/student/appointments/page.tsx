'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ArrowUpDown, MoreVertical, XCircle, Calendar,
  Clock, Eye, FileText, ChevronLeft, ChevronRight, CheckCircle, RefreshCw
} from 'lucide-react';
import { cn, getStatusColor, getStatusDot } from '@/lib/utils';
import { useSession } from 'next-auth/react';

export default function StudentAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);

  // Modal / Detail views
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  // Reschedule form
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Fetch appointments
  const fetchAppointments = async () => {
    if (!session?.user) return;
    setLoading(true);
    let url = `/api/appointments?page=${page}&limit=${limit}&sortOrder=${sortOrder}`;
    if (search) url += `&search=${search}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        let list = json.data;
        if (statusFilter !== 'All') {
          list = list.filter((a: any) => a.status === statusFilter);
        }
        setAppointments(list);
        setTotal(json.meta?.total || list.length);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [session, page, search, statusFilter, sortOrder]);

  // Cancel handler
  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });
      const json = await res.json();
      if (json.success) {
        setCancelConfirmOpen(false);
        setDetailModalOpen(false);
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reschedule submit
  const handleRescheduleSubmit = async () => {
    try {
      const res = await fetch(`/api/appointments/${selectedApt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Rescheduled',
          rescheduleReason: `Requested new date: ${newDate} at ${newTime}`
        }),
      });
      const json = await res.json();
      if (json.success) {
        setRescheduleOpen(false);
        setDetailModalOpen(false);
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            My Appointments
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track, update, or cancel your scheduled visits.
          </p>
        </div>
        <Link
          href="/appointments"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400"
        >
          + Book New
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            type="search"
            placeholder="Search by ID or official..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border border-[var(--border)] bg-black/25 text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-black/25 text-xs text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
            <option value="Rescheduled">Rescheduled</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-black/25 text-xs text-white"
          >
            <ArrowUpDown size={14} /> Date sort
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-[var(--border)]">
        {loading ? (
          <div className="py-20 text-center text-sm">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4">📅</div>
            <div className="font-bold mb-2">No appointments match your search.</div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Try changing filters or book a new appointment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-bold uppercase tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <th className="p-4">Appt. ID</th>
                  <th className="p-4">Official</th>
                  <th className="p-4">Faculty / Dept</th>
                  <th className="p-4">Scheduled Date</th>
                  <th className="p-4">Time Window</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm" style={{ borderColor: 'var(--border)' }}>
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">{a.appointmentNo}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{a.official?.user?.fullName || 'Official'}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.official?.title}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{a.official?.faculty?.shortName || 'Faculty'}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.official?.department?.name || 'Department'}</div>
                    </td>
                    <td className="p-4 font-semibold">{a.appointmentDate ? new Date(a.appointmentDate).toDateString() : ''}</td>
                    <td className="p-4 font-mono text-xs">{a.startTime} – {a.endTime}</td>
                    <td className="p-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold border uppercase', getStatusColor(a.status))}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedApt(a); setDetailModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {a.status === 'Pending' && (
                          <button
                            onClick={() => { setSelectedApt(a); setCancelConfirmOpen(true); }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            title="Cancel"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>Showing {appointments.length} of {total} appointments</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 rounded bg-black/40 border border-[var(--border)] disabled:opacity-40">
            <ChevronLeft size={14} />
          </button>
          <button disabled={appointments.length < limit} onClick={() => setPage(page + 1)} className="p-2 rounded bg-black/40 border border-[var(--border)] disabled:opacity-40">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {detailModalOpen && selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-lg glass-card rounded-2xl overflow-hidden border border-[var(--border)]">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg text-white">Appointment slip</h3>
                <button onClick={() => setDetailModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>
              <div className="p-6 flex flex-col gap-4 text-sm">
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span style={{ color: 'var(--text-secondary)' }}>ID</span>
                  <span className="font-mono font-bold text-amber-400">{selectedApt.appointmentNo}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span style={{ color: 'var(--text-secondary)' }}>Official</span>
                  <span className="font-semibold text-white">{selectedApt.official?.user?.fullName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span style={{ color: 'var(--text-secondary)' }}>Purpose</span>
                  <span className="font-medium text-white">{selectedApt.purpose}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span style={{ color: 'var(--text-secondary)' }}>Scheduled Time</span>
                  <span className="font-mono text-amber-400">{new Date(selectedApt.appointmentDate).toDateString()} at {selectedApt.startTime}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                  <span className={cn('px-2 py-0.5 rounded text-xs font-bold border uppercase', getStatusColor(selectedApt.status))}>{selectedApt.status}</span>
                </div>

                {/* Dynamic QR Code */}
                {selectedApt.status === 'Approved' && (
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 mt-2">
                    <img
                      src={`/api/qr/${selectedApt.id}`}
                      alt="Appointment Verification QR Code"
                      width={120}
                      height={120}
                      className="object-contain bg-white p-2 rounded-lg"
                    />
                    <span className="text-[10px] text-zinc-500 mt-2">Scan at the security entry point</span>
                  </div>
                )}

                {selectedApt.rejectionReason && (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-300">
                    <strong>Rejection Reason:</strong> {selectedApt.rejectionReason}
                  </div>
                )}
                {selectedApt.rescheduleReason && (
                  <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5 text-xs text-purple-300">
                    <strong>Reschedule Request:</strong> {selectedApt.rescheduleReason}
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                {selectedApt.status === 'Approved' && (
                  <button
                    onClick={() => {
                      const printContent = `
                        <div style="font-family: sans-serif; text-align: left; padding: 20px;">
                          <h2 style="margin-bottom:5px;">Hazara University</h2>
                          <h4 style="margin-top:0;color:#666;">Smart Appointment Slip</h4>
                          <hr />
                          <p><strong>Appointment ID:</strong> ${selectedApt.appointmentNo}</p>
                          <p><strong>Official:</strong> ${selectedApt.official?.user?.fullName}</p>
                          <p><strong>Scheduled Time:</strong> ${new Date(selectedApt.appointmentDate).toDateString()} at ${selectedApt.startTime}</p>
                          <p><strong>Status:</strong> ${selectedApt.status}</p>
                          <p><strong>Purpose:</strong> ${selectedApt.purpose}</p>
                          <div style="margin-top:20px;text-align:center;">
                            <img src="/api/qr/${selectedApt.id}" width="150" height="150" />
                            <p style="font-size:10px;color:#888;">Scan at the security entry point</p>
                          </div>
                        </div>
                      `;
                      const printWindow = window.open('about:blank', '_blank', 'width=600,height=600');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <body>
                              ${printContent}
                              <script>
                                window.onload = function() {
                                  window.print();
                                  window.close();
                                }
                              </script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1"
                  >
                    Print Slip
                  </button>
                )}
                {selectedApt.status === 'Pending' && (
                  <>
                    <button onClick={() => setRescheduleOpen(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1">
                      <RefreshCw size={12} /> Reschedule
                    </button>
                    <button onClick={() => setCancelConfirmOpen(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1">
                      <XCircle size={12} /> Cancel Appointment
                    </button>
                  </>
                )}
                <button onClick={() => setDetailModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-white">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelConfirmOpen && selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm glass-card rounded-2xl p-6 border border-[var(--border)] text-center">
              <h3 className="font-bold text-lg mb-2 text-white">Cancel Appointment?</h3>
              <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>Are you sure you want to cancel appointment {selectedApt.appointmentNo}? This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setCancelConfirmOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-white">No, keep it</button>
                <button onClick={() => handleCancel(selectedApt.id)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white">Yes, cancel it</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleOpen && selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-sm glass-card rounded-2xl p-6 border border-[var(--border)]">
              <h3 className="font-bold text-lg mb-4 text-white">Request Reschedule</h3>
              <div className="flex flex-col gap-4 text-sm mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>New Date</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/45 text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>New Time</label>
                  <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-black/45 text-white" />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setRescheduleOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-white">Cancel</button>
                <button onClick={handleRescheduleSubmit} className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400">Request Reschedule</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
