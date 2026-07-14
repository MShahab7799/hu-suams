'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building, BookOpen, Plus, Trash2, Edit2, CheckCircle2,
  XCircle, ChevronRight, Save, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminFacultiesPage() {
  const [activeTab, setActiveTab] = useState<'Faculties' | 'Departments' | 'Programs'>('Faculties');

  // Faculties Data & States
  const [faculties, setFaculties] = useState<any[]>([]);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [facMsg, setFacMsg] = useState<string | null>(null);

  // Departments Data & States
  const [departments, setDepartments] = useState<any[]>([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptFaculty, setNewDeptFaculty] = useState('');
  const [newDeptChairman, setNewDeptChairman] = useState('');
  const [newDeptHOD, setNewDeptHOD] = useState('');
  const [deptMsg, setDeptMsg] = useState<string | null>(null);

  // Programs Data & States
  const [programs, setPrograms] = useState<any[]>([]);
  const [newProgName, setNewProgName] = useState('');
  const [newProgDept, setNewProgDept] = useState('');
  const [progMsg, setProgMsg] = useState<string | null>(null);

  useEffect(() => {
    // Populate Initial Faculties
    setFaculties([
      { id: 'f1', name: 'Faculty of Natural & Computational Sciences', active: true },
      { id: 'f2', name: 'Faculty of Biological & Health Sciences', active: true },
      { id: 'f3', name: 'Faculty of Law & Social Sciences', active: true },
      { id: 'f4', name: 'Faculty of Arts & Humanities', active: true },
    ]);

    // Populate Initial Departments
    setDepartments([
      { id: 'd1', name: 'Computer Science', faculty: 'Natural & Computational Sciences', chairman: 'Dr. Asif Khan', hod: 'Dr. Asif Khan', active: true },
      { id: 'd2', name: 'Software Engineering', faculty: 'Natural & Computational Sciences', chairman: 'Dr. Kamran Shah', hod: 'Dr. Kamran Shah', active: true },
      { id: 'd3', name: 'Biotechnology', faculty: 'Biological & Health Sciences', chairman: 'Dr. Saira Bibi', hod: 'Dr. Saira Bibi', active: true },
    ]);

    // Populate Initial Programs
    setPrograms([
      { id: 'p1', name: 'BS Artificial Intelligence', department: 'Computer Science' },
      { id: 'p2', name: 'BS Computer Science', department: 'Computer Science' },
      { id: 'p3', name: 'BS Software Engineering', department: 'Software Engineering' },
      { id: 'p4', name: 'BS Information Technology', department: 'Software Engineering' },
    ]);
  }, []);

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyName) return;
    const newFac = { id: 'fac-' + Math.random(), name: newFacultyName, active: true };
    setFaculties([...faculties, newFac]);
    setNewFacultyName('');
    setFacMsg('Faculty added successfully!');
    setTimeout(() => setFacMsg(null), 3000);
  };

  const handleToggleFaculty = (id: string) => {
    setFaculties(faculties.map((f) => f.id === id ? { ...f, active: !f.active } : f));
  };

  const handleDeleteFaculty = (id: string) => {
    setFaculties(faculties.filter((f) => f.id !== id));
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptFaculty) return;
    const newDept = {
      id: 'dept-' + Math.random(),
      name: newDeptName,
      faculty: newDeptFaculty,
      chairman: newDeptChairman || 'Assign Pending',
      hod: newDeptHOD || 'Assign Pending',
      active: true
    };
    setDepartments([...departments, newDept]);
    setNewDeptName('');
    setNewDeptChairman('');
    setNewDeptHOD('');
    setDeptMsg('Department added successfully!');
    setTimeout(() => setDeptMsg(null), 3000);
  };

  const handleDeleteDept = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };

  const handleAddProg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgName || !newProgDept) return;
    const newProg = { id: 'prog-' + Math.random(), name: newProgName, department: newProgDept };
    setPrograms([...programs, newProg]);
    setNewProgName('');
    setProgMsg('Program added successfully!');
    setTimeout(() => setProgMsg(null), 3000);
  };

  const handleDeleteProg = (id: string) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            University Structure Setup
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Configure Hazara University hierarchy: add faculties, register departments, assign chairmans/HODs, and map BS degrees.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-black/35 border border-white/5 text-xs text-zinc-400">
          {(['Faculties', 'Departments', 'Programs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn('px-4 py-2 rounded-lg font-semibold transition-all', activeTab === tab && 'bg-amber-500 text-black font-bold')}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Panel */}
      <AnimatePresence mode="wait">
        {activeTab === 'Faculties' && (
          <motion.div key="faculties-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-3 gap-6">
            {/* Faculty Creator */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-1.5">
                <Plus size={14} /> Add University Faculty
              </h3>
              <form onSubmit={handleAddFaculty} className="flex flex-col gap-3 text-xs text-white">
                <div>
                  <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Faculty Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Faculty of..."
                    value={newFacultyName}
                    onChange={(e) => setNewFacultyName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white"
                  />
                </div>
                {facMsg && (
                  <div className="p-2 rounded border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-300">
                    {facMsg}
                  </div>
                )}
                <button type="submit" className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">
                  Register Faculty
                </button>
              </form>
            </div>

            {/* Faculty List */}
            <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white p-5 border-b border-white/5 bg-black/20">
                Registered Faculties
              </h3>
              <div className="divide-y divide-white/5">
                {faculties.map((f) => (
                  <div key={f.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all text-xs">
                    <div>
                      <span className="font-semibold text-white text-sm block">{f.name}</span>
                      <span className={`text-[10px] uppercase font-bold ${f.active ? 'text-green-400' : 'text-zinc-500'}`}>{f.active ? 'Active' : 'Deactivated'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFaculty(f.id)}
                        className={cn('px-2.5 py-1 rounded text-[10px] font-bold border uppercase', f.active ? 'text-zinc-400 border-white/10 bg-white/5' : 'text-green-400 border-green-500/20 bg-green-500/5')}
                      >
                        {f.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteFaculty(f.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Departments' && (
          <motion.div key="departments-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-3 gap-6">
            {/* Department Creator */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-1.5">
                <Plus size={14} /> Add Academic Department
              </h3>
              <form onSubmit={handleAddDept} className="flex flex-col gap-3 text-xs text-white">
                <div>
                  <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Parent Faculty *</label>
                  <select
                    value={newDeptFaculty}
                    required
                    onChange={(e) => setNewDeptFaculty(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white text-xs"
                  >
                    <option value="">Select faculty...</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Assign Chairman</label>
                  <input type="text" placeholder="Dr. Name" value={newDeptChairman} onChange={(e) => setNewDeptChairman(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Assign Head of Department (HOD)</label>
                  <input type="text" placeholder="Dr. Name" value={newDeptHOD} onChange={(e) => setNewDeptHOD(e.target.value)} className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white" />
                </div>

                {deptMsg && (
                  <div className="p-2 rounded border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-300">
                    {deptMsg}
                  </div>
                )}
                <button type="submit" className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">
                  Register Department
                </button>
              </form>
            </div>

            {/* Department List */}
            <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white p-5 border-b border-white/5 bg-black/20">
                Registered Departments
              </h3>
              <div className="divide-y divide-white/5">
                {departments.map((d) => (
                  <div key={d.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all text-xs">
                    <div>
                      <span className="font-semibold text-white text-sm block">{d.name}</span>
                      <span className="text-[10px] text-zinc-500 block">Faculty: {d.faculty}</span>
                      <span className="text-[10px] text-amber-500 font-bold block mt-1">Chairman/HOD: {d.chairman}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteDept(d.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Programs' && (
          <motion.div key="programs-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-3 gap-6">
            {/* Program Creator */}
            <div className="glass-card rounded-2xl p-5 border border-white/5 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-1.5">
                <Plus size={14} /> Add BS Program Degree
              </h3>
              <form onSubmit={handleAddProg} className="flex flex-col gap-3 text-xs text-white">
                <div>
                  <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Program Degree Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BS Computer Science"
                    value={newProgName}
                    onChange={(e) => setNewProgName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Parent Department *</label>
                  <select
                    value={newProgDept}
                    required
                    onChange={(e) => setNewProgDept(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white text-xs"
                  >
                    <option value="">Select department...</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {progMsg && (
                  <div className="p-2 rounded border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-300">
                    {progMsg}
                  </div>
                )}
                <button type="submit" className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400">
                  Register BS Program
                </button>
              </form>
            </div>

            {/* Program List */}
            <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white p-5 border-b border-white/5 bg-black/20">
                Registered BS Programs
              </h3>
              <div className="divide-y divide-white/5">
                {programs.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all text-xs">
                    <div>
                      <span className="font-semibold text-white text-sm block">{p.name}</span>
                      <span className="text-[10px] text-zinc-500 block">Department: {p.department}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteProg(p.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
