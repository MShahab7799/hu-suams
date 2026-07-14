'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight,
  Eye, FileText, CheckCircle2, XCircle
} from 'lucide-react';
import { cn, getStatusColor, getInitials } from '@/lib/utils';

export default function OfficialCalendarPage() {
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Populate mock calendar events matching status colors
    const mockEvents = [
      { id: 'e1', title: 'Zahid Mahmood - CS BS', date: 14, time: '09:00 - 09:20', status: 'Approved', desc: 'Degree signature verification request' },
      { id: 'e2', title: 'Dr. Asif - Teacher', date: 14, time: '10:00 - 10:30', status: 'Pending', desc: 'HEC grant approval discussion' },
      { id: 'e3', title: 'Kamran Shah - Alumni', date: 14, time: '11:30 - 11:50', status: 'Approved', desc: 'Transcript correction query' },
    ];
    setEvents(mockEvents);
  }, []);

  const daysInMonth = 30;
  const startOffset = 3; 

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Calendar Header Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            My Schedule Calendar
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Visualize and plan your availability layout.
          </p>
        </div>

        <div className="flex gap-1.5 p-1 rounded-xl bg-black/35 border border-white/5 text-xs text-zinc-400">
          {(['Month', 'Week', 'Day'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn('px-4 py-2 rounded-lg font-semibold transition-all', viewMode === mode && 'bg-amber-500 text-black font-bold')}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Date navigation bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl border border-white/5 bg-black/20 text-white">
            <ChevronLeft size={16} />
          </button>
          <span className="text-base font-bold text-white">July 2026</span>
          <button className="p-2 rounded-xl border border-white/5 bg-black/20 text-white">
            <ChevronRight size={16} />
          </button>
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>OFFICIAL DESK CALENDAR</span>
      </div>

      {/* Calendar Body */}
      {viewMode === 'Month' && (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/5 p-4 bg-black/25">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider py-2" style={{ color: 'var(--text-muted)' }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>

          {/* Calendar cell grid */}
          <div className="grid grid-cols-7 gap-2 h-[450px]">
            {Array.from({ length: startOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="rounded-xl bg-white/[0.01] border border-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayEvents = events.filter((e) => e.date === dayNum);

              return (
                <div
                  key={dayNum}
                  className="rounded-xl p-2 border border-white/5 bg-black/10 flex flex-col justify-between hover:bg-white/5 transition-all group min-h-[70px] relative overflow-hidden"
                >
                  <span className="text-xs font-bold text-zinc-500 group-hover:text-white transition-colors">{dayNum}</span>

                  <div className="flex flex-col gap-1 mt-1 z-10">
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => { setSelectedEvent(e); setModalOpen(true); }}
                        className={cn('text-[9px] font-bold p-1 rounded border uppercase truncate cursor-pointer transition-all hover:scale-[1.02]', getStatusColor(e.status))}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode !== 'Month' && (
        <div className="glass-card rounded-2xl p-16 border border-white/5 text-center bg-black/25">
          <CalendarIcon size={32} className="mx-auto mb-4 text-amber-500/80" />
          <h4 className="font-bold text-white text-sm mb-2">{viewMode} Mode is simulated for standard Month layouts.</h4>
          <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Switch to Month view to manage your schedule layout.</p>
        </div>
      )}

      {/* Event Details modal */}
      <AnimatePresence>
        {modalOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm glass-card rounded-2xl p-6 border border-[var(--border)]">
              <div className="flex justify-between items-start mb-4 pb-2 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">MEETING BLOCK</span>
                  <h3 className="font-bold text-sm text-white">{selectedEvent.title}</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <div className="flex flex-col gap-3 text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex justify-between">
                  <span>Topic</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">{selectedEvent.desc}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span className="font-mono text-amber-400">{selectedEvent.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={cn('px-2 py-0.5 rounded text-[9px] font-bold border uppercase', getStatusColor(selectedEvent.status))}>{selectedEvent.status}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-white w-full">Close Details</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
