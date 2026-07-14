'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Plus, Trash2, Edit2, Lock, ShieldAlert,
  UserCheck, UserX, ChevronLeft, ChevronRight, Save, UserPlus
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import type { UserRole } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal forms states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [role, setRole] = useState<UserRole>('Student');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [cnic, setCnic] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Scaffold initial list of accounts matching HU university roles
    setUsers([
      { id: '1', fullName: 'Prof. Dr. Mohsin Khan', email: 'vc@hu.edu.pk', role: 'ViceChancellor', status: 'Active', gender: 'Male', cnic: '12345-1234567-1', mobileNumber: '+92 300 1234567' },
      { id: '2', fullName: 'Dr. Shahzad Rahman', email: 'registrar@hu.edu.pk', role: 'Registrar', status: 'Active', gender: 'Male', cnic: '54321-7654321-2', mobileNumber: '+92 312 9876543' },
      { id: '3', fullName: 'Ali Ahmed', email: 'ali@hu.edu.pk', role: 'Student', status: 'Active', gender: 'Male', cnic: '98765-4321098-3', mobileNumber: '+92 333 1122334', universityId: '2023-CS-123' },
      { id: '4', fullName: 'Saira Khan', email: 'saira@hu.edu.pk', role: 'Teacher', status: 'Active', gender: 'Female', cnic: '11111-2222222-3', mobileNumber: '+92 321 4455667' },
      { id: '5', fullName: 'Bilal Khan', email: 'bilal@gmail.com', role: 'Visitor', status: 'Suspended', gender: 'Male', cnic: '22222-3333333-4', mobileNumber: '+92 345 5566778' }
    ]);
    setLoading(false);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: 'usr-' + Math.random(),
      fullName,
      email,
      role,
      status: 'Active',
      gender,
      cnic,
      mobileNumber,
      universityId
    };

    setUsers([newUser, ...users]);
    setCreateOpen(false);
    resetForm();
    setMessage('User account created successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = users.map((u) => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          fullName,
          mobileNumber,
          role,
        };
      }
      return u;
    });

    setUsers(updated);
    setEditOpen(false);
    resetForm();
    setMessage('User details updated successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        return { ...u, status: currentStatus === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    });
    setUsers(updated);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setMobileNumber('');
    setRole('Student');
    setGender('Male');
    setCnic('');
    setUniversityId('');
    setPassword('');
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            User Accounts Desk
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Scaffold registrations, assign role permissions, reset security passwords, or suspend credentials.
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setCreateOpen(true); }}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 flex items-center gap-1 shadow-lg shadow-amber-500/10"
        >
          <UserPlus size={14} /> Add User Account
        </button>
      </div>

      {/* Message alerts */}
      {message && (
        <div className="p-3.5 rounded-xl mb-6 border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-300">
          {message}
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none border border-[var(--border)] bg-black/25 text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-black/25 text-xs text-white"
          >
            <option value="All">All Roles</option>
            <option value="ViceChancellor">Vice Chancellor</option>
            <option value="Registrar">Registrar</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Visitor">Visitor</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[var(--border)] bg-black/25 text-xs text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-[var(--border)]">
        {loading ? (
          <div className="py-20 text-center text-sm">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4">👥</div>
            <div className="font-bold text-white mb-2">No users registered.</div>
            <p className="text-xs text-zinc-500">Add user accounts using the top creator button.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-bold uppercase tracking-wider bg-black/10" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">CNIC</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm" style={{ borderColor: 'var(--border)' }}>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center text-sm">
                          {getInitials(u.fullName)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.fullName}</div>
                          {u.universityId && <div className="text-[10px] font-mono text-amber-400">ID: {u.universityId}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white font-mono text-xs">{u.email}</td>
                    <td className="p-4 font-semibold text-white">{u.role}</td>
                    <td className="p-4 text-zinc-400 font-mono text-xs">{u.cnic}</td>
                    <td className="p-4">
                      <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase', u.status === 'Active' ? 'text-green-400 border-green-500/20 bg-green-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5')}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setFullName(u.fullName);
                            setMobileNumber(u.mobileNumber);
                            setRole(u.role);
                            setEditOpen(true);
                          }}
                          className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={cn('p-2 rounded-lg', u.status === 'Active' ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-green-500/10 hover:bg-green-500/20 text-green-400')}
                          title={u.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                        >
                          {u.status === 'Active' ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md glass-card rounded-2xl p-6 border border-[var(--border)]">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                <h3 className="font-bold text-white text-base">Add User Account</h3>
                <button onClick={() => setCreateOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreate} className="flex flex-col gap-4 text-xs text-white">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase mb-1 text-zinc-400">Full Name *</label>
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1 text-zinc-400">Email Address *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase mb-1 text-zinc-400">Mobile Number *</label>
                    <input type="text" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1 text-zinc-400">National CNIC *</label>
                    <input type="text" required placeholder="XXXXX-XXXXXXX-X" value={cnic} onChange={(e) => setCnic(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase mb-1 text-zinc-400">Assign Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white">
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher / Faculty</option>
                      <option value="ViceChancellor">Vice Chancellor</option>
                      <option value="Registrar">Registrar</option>
                      <option value="Dean">Dean</option>
                      <option value="Chairman">Chairman</option>
                      <option value="HOD">Head of Department (HOD)</option>
                      <option value="Assistant">Assistant</option>
                      <option value="Visitor">Visitor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase mb-1 text-zinc-400">University Student/Faculty ID</label>
                    <input type="text" placeholder="Optional" value={universityId} onChange={(e) => setUniversityId(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-lg bg-zinc-800 text-white font-semibold">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">Create Account</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md glass-card rounded-2xl p-6 border border-[var(--border)]">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-white/5">
                <h3 className="font-bold text-white text-base">Edit User Account</h3>
                <button onClick={() => setEditOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleEditSave} className="flex flex-col gap-4 text-xs text-white">
                <div>
                  <label className="block font-semibold uppercase mb-1 text-zinc-400">Full Name *</label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                </div>

                <div>
                  <label className="block font-semibold uppercase mb-1 text-zinc-400">Mobile Number *</label>
                  <input type="text" required value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                </div>

                <div>
                  <label className="block font-semibold uppercase mb-1 text-zinc-400">Assign Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white">
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher / Faculty</option>
                    <option value="ViceChancellor">Vice Chancellor</option>
                    <option value="Registrar">Registrar</option>
                    <option value="Dean">Dean</option>
                    <option value="Chairman">Chairman</option>
                    <option value="HOD">Head of Department (HOD)</option>
                    <option value="Assistant">Assistant</option>
                    <option value="Visitor">Visitor</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 rounded-lg bg-zinc-800 text-white font-semibold">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
