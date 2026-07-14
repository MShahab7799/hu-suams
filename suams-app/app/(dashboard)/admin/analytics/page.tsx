'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, PieChart, Activity } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [facultyStats] = useState([
    { name: 'Natural & Computational Sciences', count: 58, pct: 41 },
    { name: 'Biological & Health Sciences', count: 42, pct: 29 },
    { name: 'Law & Social Sciences', count: 25, pct: 18 },
    { name: 'Arts & Humanities', count: 17, pct: 12 },
  ]);

  const [monthlyTrends] = useState([
    { month: 'Jan', count: 90 },
    { month: 'Feb', count: 110 },
    { month: 'Mar', count: 140 },
    { month: 'Apr', count: 115 },
    { month: 'May', count: 160 },
    { month: 'Jun', count: 142 },
  ]);

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            System Traffic & Load Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Monitor peak traffic patterns, department completion rates, and busy slots load.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Trend bar chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 bg-black/25">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-amber-500" /> Appointments load per month
          </h3>

          <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 relative">
            <div className="absolute left-0 right-0 top-1/2 border-t border-white/5 border-dashed pointer-events-none" />
            {monthlyTrends.map((trend) => (
              <div key={trend.month} className="flex-1 flex flex-col items-center gap-2 z-10">
                <span className="text-[10px] text-zinc-500 font-mono">{trend.count}</span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-amber-500 rounded-t-lg transition-all duration-300 hover:opacity-85"
                  style={{ height: `${(trend.count / 180) * 100}%` }}
                />
                <span className="text-[10px] font-mono text-zinc-500">{trend.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty share stats */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-4 pb-2 border-b border-white/5 flex items-center gap-1.5">
              <PieChart size={14} className="text-amber-500" /> Appointments share per faculty
            </h3>
            <div className="flex flex-col gap-4">
              {facultyStats.map((item) => (
                <div key={item.name} className="text-xs">
                  <div className="flex justify-between mb-1.5 text-zinc-300">
                    <span className="font-medium truncate max-w-[200px]">{item.name}</span>
                    <span className="font-mono text-white">{item.count} appts ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
