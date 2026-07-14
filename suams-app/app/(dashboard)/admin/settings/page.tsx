'use client';

import { useState } from 'react';
import { Save, Database, Shield, Server, Mail, MessageSquare } from 'lucide-react';

export default function AdminSettingsPage() {
  const [universityName, setUniversityName] = useState('Hazara University Mansehra');
  const [smtpServer, setSmtpServer] = useState('smtp.hu.edu.pk');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smsGateway, setSmsGateway] = useState('https://api.sms-gateway.pk/send');
  const [isBackupDone, setIsBackupDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('System parameters successfully saved!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBackup = () => {
    setIsBackupDone(true);
    setMessage('SQL Database backup generated successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            System & Configurations Control
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Configure University branding assets, SMTP email nodes, SMS gateways, and trigger database dumps.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-xl mb-6 border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-300">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Right Columns: Main Config Forms */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-5 text-xs text-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
              <Server size={14} /> University Info & Branding
            </h3>

            <div>
              <label className="block font-semibold uppercase mb-1 text-zinc-400">Branding Name *</label>
              <input type="text" value={universityName} onChange={(e) => setUniversityName(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
            </div>

            <div className="border-t border-white/5 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-1.5">
                <Mail size={14} /> SMTP Email Credentials
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase mb-1 text-zinc-400">SMTP Host</label>
                  <input type="text" value={smtpServer} onChange={(e) => setSmtpServer(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1 text-zinc-400">SMTP Port</label>
                  <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white font-mono" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-1.5">
                <MessageSquare size={14} /> SMS Gateway Node
              </h3>
              <div>
                <label className="block font-semibold uppercase mb-1 text-zinc-400">API Endpoint URL</label>
                <input type="text" value={smsGateway} onChange={(e) => setSmsGateway(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white font-mono" />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 flex items-center justify-center gap-1.5 transition-all text-sm mt-4 shadow-lg shadow-amber-500/10"
            >
              <Save size={16} /> Save Configurations
            </button>
          </form>
        </div>

        {/* Left Column: DB Maintenance */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
            <h3 className="font-bold text-xs uppercase tracking-widest text-white pb-2 border-b border-white/5 flex items-center gap-1.5">
              <Database size={14} className="text-amber-500" /> Database Backup
            </h3>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Generate a full backup dump of the SQL Server database schema, tables, and settings.
            </p>
            <button
              onClick={handleBackup}
              className="py-2.5 rounded-xl border border-white/5 bg-black/25 font-bold hover:bg-white/5 text-xs text-white"
            >
              Create Database Backup
            </button>

            {isBackupDone && (
              <a
                href="#"
                className="py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-center font-bold text-emerald-400 text-xs hover:bg-emerald-600/20"
              >
                📥 Download suams_backup.sql
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
