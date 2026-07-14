'use client';

import { useState, useEffect } from 'react';
import {
  Search, Filter, Eye, ChevronLeft, ChevronRight, CheckCircle2,
  XCircle, Clock, Calendar, Mail, FileText
} from 'lucide-react';
import { cn, getStatusColor } from '@/lib/utils';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    // Scaffold system wide appointment entries for HU officials
    setAppointments([
      { id: '1', appointmentNo: 'APT-2026-0091', bookedBy: { fullName: 'Zahid Mahmood', role: 'Student' }, official: { title: 'Vice Chancellor', user: { fullName: 'Prof. Dr. Mohsin Khan' } }, purpose: 'Degree Verification and Urgent Signature', priority: 'High', appointmentDate: '2026-07-14', startTime: '10:00', endTime: '10:20', status: 'Pending' },
      { id: '2', appointmentNo: 'APT-2026-0092', bookedBy: { fullName: 'Dr. Asif Khan', role: 'Teacher' }, official: { title: 'Vice Chancellor', user: { fullName: 'Prof. Dr. Mohsin Khan' } }, purpose: 'HEC Research Grant Approval Support', priority: 'Medium', appointmentDate: '2026-07-14', startTime: '11:00', endTime: '11:30', status: 'Approved' },
      { id: '3', appointmentNo: 'APT-2026-0093', bookedBy: { fullName: 'Saira Bibi', role: 'Parent' }, official: { title: 'Registrar', user: { fullName: 'Dr. Shahzad Rahman' } }, purpose: 'Late Admission Deadline Appeal', priority: 'Low', appointmentDate: '2026-07-15', startTime: '09:30', endTime: '09:50', status: 'Pending' }
    ]);
    setLoading(false);
  }, []);

  const filteredAppts = appointments.filter((a) => {
    const matchesSearch =
      a.appointmentNo.toLowerCase().includes(search.toLowerCase()) ||
      a.bookedBy.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.official.user.fullName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Global Appointment Ledger
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            System-wide timeline monitoring of all active, approved, or pending meetings.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
          <input
            type="search"
            placeholder="Search by ID, applicant, or official..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border border-[var(--border)] bg-black/25 text-white"
          />
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-black/25 text-xs text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-[var(--border)]">
        {loading ? (
          <div className="py-20 text-center text-sm">Loading ledger...</div>
        ) : filteredAppts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4">📅</div>
            <div className="font-bold text-white mb-2">No schedules logged.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-bold uppercase tracking-wider bg-black/10" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <th className="p-4">ID</th>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Official Target</th>
                  <th className="p-4">Schedule Date/Time</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm" style={{ borderColor: 'var(--border)' }}>
                {filteredAppts.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">{a.appointmentNo}</td>
                    <td className="p-4 text-white font-semibold">{a.bookedBy.fullName}</td>
                    <td className="p-4 text-zinc-300">{a.official.user.fullName} ({a.official.title})</td>
                    <td className="p-4">
                      <div className="text-white">{a.appointmentDate}</div>
                      <div className="text-[10px] font-mono text-zinc-500">{a.startTime} - {a.endTime}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${a.priority === 'High' ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-amber-400 border-amber-500/20 bg-amber-500/5'}`}>
                        {a.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase', getStatusColor(a.status))}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
