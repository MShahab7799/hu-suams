'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, Camera, History, Eye, CalendarDays, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn, getStatusColor, getStatusDot, formatDate, formatTime } from '@/lib/utils';

type Tab = 'profile' | 'password' | 'history';

export default function StudentProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [semester, setSemester] = useState<number>(1);
  const [role, setRole] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  // Appointment history
  const [appointments, setAppointments] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
          setGender(u.gender || 'Male');
          setSemester(u.semester || 1);
          setRole(u.role || 'Student');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      setHistoryLoading(true);
      fetch('/api/appointments?page=1&limit=20&sortOrder=desc')
        .then(r => r.json())
        .then(json => {
          if (json.success) setAppointments(json.data || []);
        })
        .catch(() => {})
        .finally(() => setHistoryLoading(false));
    }
  }, [activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          gender,
          semester: Number(semester) || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage('Profile updated successfully!');
        updateSession({ name: fullName });
      } else {
        setError(json.error || 'Failed to update profile');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwMessage(null);

    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (json.success) {
        setPwMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwError(json.error || 'Failed to change password. Check your current password.');
      }
    } catch {
      setPwError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: 'profile', label: 'Personal Info', icon: User },
    { key: 'password', label: 'Change Password', icon: Lock },
    { key: 'history', label: 'Appointment History', icon: History },
  ];

  const statusIcons: Record<string, any> = {
    Approved: CheckCircle,
    Rejected: XCircle,
    Pending: Clock,
    Cancelled: XCircle,
    Completed: CheckCircle,
    Rescheduled: CalendarDays,
    NoShow: AlertCircle,
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold font-display mb-8" style={{ color: 'var(--text-primary)' }}>
        My Profile
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Avatar & nav */}
        <div>
          {/* Avatar card */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center text-center mb-4"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          >
            <div className="relative group cursor-pointer mb-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl"
                style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff' }}
              >
                {fullName.charAt(0) || '?'}
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                <Camera size={14} /> Edit
              </div>
            </div>
            <h3 className="font-bold text-white text-sm mb-0.5">{fullName || 'Your Name'}</h3>
            <span className="text-xs" style={{ color: 'var(--hu-accent)' }}>{role}</span>
            <span className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Hazara University</span>
          </div>

          {/* Tab nav */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          >
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setMessage(null); setError(null); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-all"
                style={{
                  background: activeTab === key ? 'rgba(27,77,62,0.3)' : 'transparent',
                  borderLeft: activeTab === key ? '3px solid var(--hu-primary-light)' : '3px solid transparent',
                  color: activeTab === key ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl p-6"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--hu-accent)' }}>
                  <User size={13} /> Personal Information
                </h3>

                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-sm block mb-2">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none transition-colors"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--hu-accent)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                      />
                    </div>
                    <div>
                      <label className="label-sm block mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full p-2.5 rounded-xl border text-sm outline-none cursor-not-allowed opacity-50"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-sm block mb-2">Mobile Number</label>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none transition-colors"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--hu-accent)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                      />
                    </div>
                    <div>
                      <label className="label-sm block mb-2">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none transition-colors"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="PreferNotToSay">Prefer Not To Say</option>
                      </select>
                    </div>
                  </div>

                  {role === 'Student' && (
                    <div className="w-1/2 pr-2">
                      <label className="label-sm block mb-2">Current Semester</label>
                      <input
                        type="number"
                        min={1}
                        max={16}
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value) || 1)}
                        className="w-full p-2.5 rounded-xl border text-sm outline-none"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  )}

                  {message && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
                      ✓ {message}
                    </div>
                  )}
                  {error && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                      ✕ {error}
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, var(--hu-accent-light, #E8C048), var(--hu-accent))', color: '#000' }}
                    >
                      <Save size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl p-6"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--hu-accent)' }}>
                  <Lock size={13} /> Change Password
                </h3>

                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                  <div>
                    <label className="label-sm block mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border text-sm outline-none"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--hu-accent)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                    />
                  </div>
                  <div>
                    <label className="label-sm block mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border text-sm outline-none"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      onFocus={e => (e.target.style.borderColor = 'var(--hu-accent)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                    />
                    {newPassword.length > 0 && (
                      <div className="mt-1.5 flex gap-1">
                        {['Length ≥ 8', 'Uppercase', 'Number'].map((req, i) => {
                          const checks = [newPassword.length >= 8, /[A-Z]/.test(newPassword), /\d/.test(newPassword)];
                          return (
                            <span key={req} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: checks[i] ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', color: checks[i] ? '#4ade80' : 'var(--text-muted)' }}>
                              {checks[i] ? '✓' : '○'} {req}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="label-sm block mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border text-sm outline-none"
                      style={{
                        background: 'var(--surface)',
                        border: `1px solid ${confirmPassword && confirmPassword !== newPassword ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
                        color: 'var(--text-primary)',
                      }}
                      onFocus={e => (e.target.style.borderColor = 'var(--hu-accent)')}
                      onBlur={e => (e.target.style.borderColor = confirmPassword && confirmPassword !== newPassword ? 'rgba(239,68,68,0.5)' : 'var(--border)')}
                    />
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs mt-1" style={{ color: '#f87171' }}>Passwords do not match</p>
                    )}
                  </div>

                  {pwMessage && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
                      ✓ {pwMessage}
                    </div>
                  )}
                  {pwError && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                      ✕ {pwError}
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff' }}
                    >
                      <Lock size={14} /> {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl p-6"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: 'var(--hu-accent)' }}>
                  <History size={13} /> Appointment History
                </h3>

                {historyLoading ? (
                  <div className="flex items-center justify-center py-12 gap-2" style={{ color: 'var(--text-muted)' }}>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span className="text-sm">Loading history...</span>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No appointments yet.</p>
                    <a href="/appointments" className="text-xs mt-2 inline-block" style={{ color: 'var(--hu-accent)' }}>
                      Book your first appointment →
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {appointments.map((apt: any) => {
                      const StatusIcon = statusIcons[apt.status] || Clock;
                      return (
                        <div
                          key={apt.id}
                          className="flex items-center gap-4 p-4 rounded-xl"
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                        >
                          <div
                            className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', getStatusDot(apt.status))}
                            style={{ background: 'transparent', border: '1px solid currentColor' }}
                          >
                            <StatusIcon size={13} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white truncate">
                              {apt.official?.user?.fullName || 'Unknown Official'}
                            </div>
                            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                              {apt.official?.title} · {apt.appointmentDate ? formatDate(apt.appointmentDate) : '—'} at {apt.startTime ? formatTime(apt.startTime) : '—'}
                            </div>
                          </div>
                          <span
                            className={cn('text-[11px] font-bold px-2.5 py-1 rounded-lg border flex-shrink-0', getStatusColor(apt.status))}
                          >
                            {apt.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
