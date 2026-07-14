'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, Camera, Clock, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function OfficialProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Official states
  const [availability, setAvailability] = useState('Available');
  const [officeHours, setOfficeHours] = useState('09:00 AM - 02:00 PM');
  const [vacationStart, setVacationStart] = useState('');
  const [vacationEnd, setVacationEnd] = useState('');

  // Load profile data on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/users/profile');
        const json = await res.json();
        if (json.success && json.data) {
          const u = json.data;
          setFullName(u.fullName || '');
          setEmail(u.email || '');
          setMobileNumber(u.mobileNumber || '');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const payload: any = {
        fullName,
        mobileNumber,
      };

      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          setError('Both current and new password are required to change password.');
          setLoading(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setMessage('Official profile & settings updated successfully!');
        updateSession({ name: fullName });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setError(json.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold font-display mb-8" style={{ color: 'var(--text-primary)' }}>
        My Profile & Secretariat Settings
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Status */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-4">
              <div className="w-24 h-24 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-bold text-3xl overflow-hidden">
                {fullName.charAt(0)}
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                <Camera size={16} className="mr-1" /> Edit
              </div>
            </div>
            <h3 className="font-bold text-white text-sm">{fullName}</h3>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1 inline-block">Hazara University Official</span>
          </div>

          <div className="border-t border-white/5 pt-4 flex flex-col gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Availability Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white"
              >
                <option value="Available">🟢 Available</option>
                <option value="Busy">🔴 Busy / In Meeting</option>
                <option value="Out of Office">🟡 Out of Office</option>
                <option value="On Vacation">🌴 On Vacation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Columns: Profile Form */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-6 flex items-center gap-2">
              <User size={14} /> Official Desk Info
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-zinc-400">Secretariat Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-black/40 text-zinc-400 text-sm outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-zinc-400">Office Helpline Phone</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-zinc-400">Default Office Hours</label>
                  <input
                    type="text"
                    value={officeHours}
                    onChange={(e) => setOfficeHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-sm outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Vacation Dates */}
              <div className="border-t border-white/5 pt-6 mt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-6 flex items-center gap-2">
                  <Calendar size={14} /> Vacation Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-zinc-400">Vacation Start</label>
                    <input
                      type="date"
                      value={vacationStart}
                      onChange={(e) => setVacationStart(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-zinc-400">Vacation End</label>
                    <input
                      type="date"
                      value={vacationEnd}
                      onChange={(e) => setVacationEnd(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Security section */}
              <div className="border-t border-white/5 pt-6 mt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-6 flex items-center gap-2">
                  <Lock size={14} /> Security
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-zinc-400">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-zinc-400">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-white/5 bg-black/25 text-white text-sm outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {message && (
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-300">
                  {message}
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 flex items-center justify-center gap-1.5 transition-all text-sm mt-4 shadow-lg shadow-amber-500/10"
              >
                <Save size={16} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
