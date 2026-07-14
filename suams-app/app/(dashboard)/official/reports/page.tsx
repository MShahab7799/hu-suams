'use client';

import { useState } from 'react';
import {
  FileText, Download, BarChart3, TrendingUp, Users, Calendar,
  PieChart, AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function OfficialReportsPage() {
  const [reportType, setReportType] = useState('Daily');
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExporting(format);
    setTimeout(() => setExporting(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            Reports & Meeting Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Analyze attendance stats, queue completion rates, and print desk summary reports.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Statistics Cards */}
        {[
          { label: 'Weekly Completion Rate', value: '92.6%', change: '↑ 1.4% vs last week', icon: CheckCircle2, color: '#22C55E' },
          { label: 'Peak Meeting hour', value: '10:00 AM', change: '4 visits average', icon: BarChart3, color: '#C5A028' },
          { label: 'Primary Visitor Category', value: 'Students', change: '65% of total requests', icon: Users, color: '#3B82F6' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-5 rounded-2xl bg-black/20 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: stat.color }} />
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/5">
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: stat.color }}>{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Exporters */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-1.5">
              <FileText size={14} className="text-amber-400" /> Export Options
            </h3>

            <div className="flex flex-col gap-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase mb-2 text-zinc-400">Report Scope</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-white/5 bg-black/35 text-white"
                  >
                    <option>Daily Report</option>
                    <option>Weekly Summary</option>
                    <option>Monthly Analytics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-2 text-zinc-400">Data Details</label>
                  <select className="w-full p-3 rounded-xl border border-white/5 bg-black/35 text-white">
                    <option>Full timelines + Notes</option>
                    <option>Schedules totals only</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4 border-t border-white/5 pt-6">
                <span className="font-bold text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Available Export Formats</span>
                <div className="grid grid-cols-3 gap-3">
                  {['PDF', 'Excel', 'CSV'].map((format) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      disabled={exporting !== null}
                      className="p-3 rounded-xl border border-white/5 bg-black/25 font-bold hover:bg-white/5 flex items-center justify-center gap-1.5 transition-all text-white disabled:opacity-40"
                    >
                      <Download size={14} />
                      {exporting === format ? `Exporting...` : `Export as ${format}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mini analytics stats */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-1.5">
              <PieChart size={14} className="text-amber-400" /> Hourly Load Distribution
            </h3>
            <div className="flex flex-col gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between">
                <span>09:00 – 10:00</span>
                <span className="font-mono text-white">20% load</span>
              </div>
              <div className="flex justify-between">
                <span>10:00 – 11:00</span>
                <span className="font-mono text-amber-400 font-bold">50% load (Peak)</span>
              </div>
              <div className="flex justify-between">
                <span>11:00 – 12:00</span>
                <span className="font-mono text-white">25% load</span>
              </div>
              <div className="flex justify-between">
                <span>12:00 – 13:00</span>
                <span className="font-mono text-white">5% load</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
