'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, Plus, Trash2, Calendar, Coffee, Save,
  CheckCircle, AlertTriangle
} from 'lucide-react';

export default function OfficialTimeSlotsPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [workingStart, setWorkingStart] = useState('09:00');
  const [workingEnd, setWorkingEnd] = useState('14:00');
  const [lunchStart, setLunchStart] = useState('13:00');
  const [lunchEnd, setLunchEnd] = useState('14:00');
  const [maxAppointments, setMaxAppointments] = useState(8);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [dayOfWeek, setDayOfWeek] = useState('1'); // 1 = Monday
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState('20');

  useEffect(() => {
    setSlots([
      { id: '1', day: 'Monday', time: '09:00 - 09:20', active: true },
      { id: '2', day: 'Monday', time: '09:30 - 09:50', active: true },
      { id: '3', day: 'Tuesday', time: '10:00 - 10:20', active: true },
      { id: '4', day: 'Wednesday', time: '11:00 - 11:20', active: true },
    ]);
  }, []);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [h, m] = startTime.split(':').map(Number);
    const endMins = h * 60 + m + Number(duration);
    const endStr = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;

    const newSlot = {
      id: 'slot-' + Math.random(),
      day: days[Number(dayOfWeek)],
      time: `${startTime} - ${endStr}`,
      active: true,
    };

    setSlots([...slots, newSlot]);
    setMessage('Time slot added successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id));
  };

  const handleSaveSettings = () => {
    setMessage('Schedule configurations saved!');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            My Availability & Time Slots
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Configure working hours, recurring days, break times, and vacations.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Slots Creator & List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* New Slot Form */}
          <div className="glass-card rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-1.5">
              <Plus size={14} /> Create Weekly Time Slot
            </h3>
            <form onSubmit={handleAddSlot} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Day</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-xs outline-none"
                >
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-xs outline-none"
                >
                  <option value="15">15 Mins</option>
                  <option value="20">20 Mins</option>
                  <option value="30">30 Mins</option>
                  <option value="45">45 Mins</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400"
              >
                Add Slot
              </button>
            </form>
          </div>

          {/* Time Slots List */}
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white p-5 border-b border-white/5 bg-black/20">
              Active Time Slots
            </h3>
            <div className="divide-y divide-white/5">
              {slots.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between text-xs hover:bg-white/5 transition-all">
                  <div>
                    <span className="font-semibold text-white mr-4">{s.day}</span>
                    <span className="font-mono text-amber-400">{s.time}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSlot(s.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: General parameters */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Clock size={14} /> Schedule Limits
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-zinc-400">Working Start</label>
                <input type="time" value={workingStart} onChange={(e) => setWorkingStart(e.target.value)} className="w-full p-2 rounded-lg border border-white/5 bg-black/25 text-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-zinc-400">Working End</label>
                <input type="time" value={workingEnd} onChange={(e) => setWorkingEnd(e.target.value)} className="w-full p-2 rounded-lg border border-white/5 bg-black/25 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-zinc-400">Lunch Start</label>
                <input type="time" value={lunchStart} onChange={(e) => setLunchStart(e.target.value)} className="w-full p-2 rounded-lg border border-white/5 bg-black/25 text-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-zinc-400">Lunch End</label>
                <input type="time" value={lunchEnd} onChange={(e) => setLunchEnd(e.target.value)} className="w-full p-2 rounded-lg border border-white/5 bg-black/25 text-white" />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold mb-1.5 text-zinc-400">Max Daily Limit</label>
              <input
                type="number"
                value={maxAppointments}
                onChange={(e) => setMaxAppointments(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white font-mono"
              />
            </div>

            {message && (
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-[11px] text-emerald-300">
                {message}
              </div>
            )}

            <button
              onClick={handleSaveSettings}
              className="w-full py-3 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 flex items-center justify-center gap-1 mt-2"
            >
              Save Schedule Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
