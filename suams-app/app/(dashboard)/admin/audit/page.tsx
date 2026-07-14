'use client';

import { useState, useEffect } from 'react';
import { Shield, Eye, Trash2, Search, Filter } from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Scaffold initial list of audit logs
    setLogs([
      { id: '1', action: 'User Login', user: 'Admin Account (admin@hu.edu.pk)', details: 'Successfully authorized session from IP 192.168.14.22', timestamp: '2026-07-14 00:30:15' },
      { id: '2', action: 'Update Schedule Slot', user: 'Registrar Secretary (assistant@hu.edu.pk)', details: 'Added 2 recurring slots for Tuesday slot group', timestamp: '2026-07-13 23:15:00' },
      { id: '3', action: 'Rescheduled Appointment', user: 'VC Secretariat (assistant@hu.edu.pk)', details: 'APT-2026-0092 rescheduled proposal sent', timestamp: '2026-07-13 22:50:11' },
      { id: '4', action: 'Auth Register', user: 'Ali Ahmed (student@hu.edu.pk)', details: 'New Student account created in Computer Science', timestamp: '2026-07-13 20:10:45' }
    ]);
  }, []);

  const filteredLogs = logs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">Security Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Audit Logs
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Real-time tracking of every authorization session, profile update, role shift, and appointment decision.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
          <input
            type="search"
            placeholder="Search by action, actor, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border border-[var(--border)] bg-black/25 text-white"
          />
        </div>
      </div>

      {/* Logs queue */}
      <div className="glass-card rounded-2xl overflow-hidden border border-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b font-bold uppercase tracking-wider bg-black/10" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                <th className="p-4">Action</th>
                <th className="p-4">Actor Email</th>
                <th className="p-4">Operation Description</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y text-zinc-300" style={{ borderColor: 'var(--border)' }}>
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white uppercase">{l.action}</td>
                  <td className="p-4 font-semibold">{l.user}</td>
                  <td className="p-4">{l.details}</td>
                  <td className="p-4 font-mono text-zinc-500">{l.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
