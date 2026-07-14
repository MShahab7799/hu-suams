'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

interface AppointmentCalendarProps {
  selectedDate: string;          // ISO date string YYYY-MM-DD
  onSelectDate: (date: string) => void;
  availableSlots?: string[];     // ['09:00', '09:30', ...] for selected date
  selectedSlot?: string;
  onSelectSlot?: (slot: string) => void;
  disabledDates?: string[];      // ISO date strings to disable
  maxFutureDays?: number;        // default 90 days out
  loadingSlotsFor?: string;      // date currently loading slots
}

function formatISO(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatSlot(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 || 12;
  return `${display}:${String(m).padStart(2, '0')} ${period}`;
}

export default function AppointmentCalendar({
  selectedDate,
  onSelectDate,
  availableSlots = [],
  selectedSlot,
  onSelectSlot,
  disabledDates = [],
  maxFutureDays = 90,
  loadingSlotsFor,
}: AppointmentCalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [direction, setDirection] = useState(0); // -1 prev, 1 next

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + maxFutureDays);
    return d;
  }, [today, maxFutureDays]);

  // Build calendar grid
  const { days, firstDow } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const firstDow = firstDay.getDay();
    const days = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(viewYear, viewMonth, d));
    }
    return { days, firstDow };
  }, [viewYear, viewMonth]);

  const goToPrev = () => {
    setDirection(-1);
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const goToNext = () => {
    setDirection(1);
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (d: Date): boolean => {
    if (d < today) return true;
    if (d > maxDate) return true;
    if (d.getDay() === 0 || d.getDay() === 6) return true; // weekends
    const iso = formatISO(d);
    if (disabledDates.includes(iso)) return true;
    return false;
  };

  const isToday = (d: Date) => formatISO(d) === formatISO(today);
  const isSelected = (d: Date) => formatISO(d) === selectedDate;
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;
    onSelectDate(formatISO(d));
  };

  // Can we navigate to prev month?
  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth();

  return (
    <div className="flex flex-col gap-5">
      {/* ── Month navigation ─────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <button
            onClick={goToPrev}
            disabled={!canGoPrev}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/8"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-center">
            <div className="font-bold text-white text-base">
              {MONTHS[viewMonth]} {viewYear}
            </div>
          </div>

          <button
            onClick={goToNext}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/8"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 px-4 pt-4 pb-1">
          {DAYS_OF_WEEK.map(d => (
            <div
              key={d}
              className="text-center text-[11px] font-bold uppercase tracking-wide pb-2"
              style={{ color: d === 'Sun' || d === 'Sat' ? 'var(--text-muted)' : 'var(--text-secondary)' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${viewYear}-${viewMonth}`}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 gap-1 px-4 pb-4"
          >
            {/* Empty cells before first day */}
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {days.map((day) => {
              const disabled = isDisabled(day);
              const selected = isSelected(day);
              const todayFlag = isToday(day);
              const weekend = isWeekend(day);

              return (
                <button
                  key={day.getDate()}
                  onClick={() => handleSelect(day)}
                  disabled={disabled}
                  className={cn(
                    'cal-day relative transition-all',
                    selected && 'cal-day-selected',
                    !selected && todayFlag && 'cal-day-today',
                    disabled && !weekend && 'cal-day-disabled',
                    weekend && !selected && 'cal-day-weekend',
                  )}
                  style={{
                    color: selected ? '#fff' : todayFlag && !selected ? 'var(--hu-accent)' : 'var(--text-secondary)',
                  }}
                >
                  {day.getDate()}
                  {/* Dot indicator for today */}
                  {todayFlag && !selected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div
          className="flex items-center gap-5 px-5 py-3 text-[10px] uppercase font-semibold tracking-wider"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))' }} />
            Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border border-amber-400" />
            Today
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ background: 'var(--border)' }} />
            Unavailable
          </span>
        </div>
      </div>

      {/* ── Time Slots ───────────────────────────── */}
      {selectedDate && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
        >
          <div
            className="flex items-center gap-2 px-5 py-4"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <Clock size={15} style={{ color: 'var(--hu-accent)' }} />
            <span className="font-bold text-sm text-white">Available Time Slots</span>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <div className="p-4">
            {loadingSlotsFor === selectedDate ? (
              <div className="flex items-center justify-center py-8 gap-2" style={{ color: 'var(--text-muted)' }}>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span className="text-sm">Loading available slots...</span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No available slots for this date.</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Please select another date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <motion.button
                    key={slot}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectSlot?.(slot)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all"
                    style={
                      selectedSlot === slot
                        ? { background: 'linear-gradient(135deg, var(--hu-accent-light, #E8C048), var(--hu-accent))', color: '#000', boxShadow: '0 4px 12px rgba(197,160,40,0.3)' }
                        : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
                    }
                  >
                    {formatSlot(slot)}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
