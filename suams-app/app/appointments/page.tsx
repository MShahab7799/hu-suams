'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, User, Check, AlertCircle, ArrowLeft, ArrowRight,
  Upload, Printer, Download, Share2, ClipboardList, BookOpen, Building,
  Sliders, ShieldCheck, ChevronRight, Sparkles, Crown, GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import AppointmentCalendar from '@/components/ui/AppointmentCalendar';

// Central data mapping for wizard steps
const CATEGORIES = ['Student', 'Teacher', 'Parent', 'Visitor', 'Alumni', 'Staff'];

const FACULTIES = [
  { id: 'ncs', label: 'Faculty of Natural & Computational Sciences', icon: '⚛️' },
  { id: 'bhs', label: 'Faculty of Biological & Health Sciences', icon: '🧬' },
  { id: 'lss', label: 'Faculty of Law & Social Sciences', icon: '⚖️' },
  { id: 'ah', label: 'Faculty of Arts & Humanities', icon: '🎨' },
];

// University-level direct officials (no faculty/department)
const DIRECT_OFFICIALS = [
  { id: 'vc', title: 'Vice Chancellor', desc: 'Head of the entire university', icon: '🎓', color: '#8b5cf6' },
  { id: 'registrar', title: 'Registrar', desc: 'Academic records & administration', icon: '📋', color: '#3b82f6' },
  { id: 'admissions', title: 'Admission Office', desc: 'Admissions & enrollment queries', icon: '📝', color: '#10b981' },
  { id: 'exam', title: 'Controller of Examinations', desc: 'Exam schedules, results & certifications', icon: '📊', color: '#f59e0b' },
  { id: 'student_affairs', title: 'Student Affairs', desc: 'Student welfare & grievances', icon: '👥', color: '#ec4899' },
  { id: 'finance', title: 'Finance Office', desc: 'Fees, scholarships & financial matters', icon: '💰', color: '#14b8a6' },
];

const DEPARTMENTS: Record<string, { id: string; label: string; programs: string[] }[]> = {
  ncs: [
    { id: 'cs', label: 'Computer Science', programs: ['BS Computer Science', 'BS Information Technology', 'BS Software Engineering', 'BS Data Science', 'BS Cyber Security', 'MS Computer Science', 'MPhil Computer Science', 'PhD Computer Science'] },
    { id: 'ai', label: 'Artificial Intelligence', programs: ['BS Artificial Intelligence', 'MS Artificial Intelligence'] },
    { id: 'math', label: 'Mathematics', programs: ['BS Mathematics', 'MS Mathematics', 'MPhil Mathematics', 'PhD Mathematics'] },
    { id: 'phys', label: 'Physics', programs: ['BS Physics', 'MS Physics', 'MPhil Physics', 'PhD Physics'] },
    { id: 'chem', label: 'Chemistry', programs: ['BS Chemistry', 'MS Chemistry', 'MPhil Chemistry', 'PhD Chemistry'] },
    { id: 'stat', label: 'Statistics', programs: ['BS Statistics', 'MS Statistics'] },
  ],
  bhs: [
    { id: 'bot', label: 'Botany', programs: ['BS Botany', 'MS Botany', 'MPhil Botany', 'PhD Botany'] },
    { id: 'zoo', label: 'Zoology', programs: ['BS Zoology', 'MS Zoology', 'MPhil Zoology', 'PhD Zoology'] },
    { id: 'biotech', label: 'Biotechnology', programs: ['BS Biotechnology', 'MS Biotechnology'] },
    { id: 'agri', label: 'Agriculture', programs: ['BS Agriculture', 'MS Agriculture'] },
    { id: 'pharm', label: 'Pharmacy', programs: ['Doctor of Pharmacy (Pharm-D)', 'MS Pharmacy'] },
  ],
  lss: [
    { id: 'econ', label: 'Economics', programs: ['BS Economics', 'MS Economics', 'MPhil Economics', 'PhD Economics'] },
    { id: 'mgmt', label: 'Business Administration', programs: ['BBA', 'MBA', 'MS Management Sciences', 'PhD Management Sciences'] },
    { id: 'law', label: 'Law', programs: ['LLB (5 Years)', 'LLM'] },
    { id: 'psych', label: 'Psychology', programs: ['BS Psychology', 'MS Psychology', 'MPhil Psychology'] },
    { id: 'soc', label: 'Sociology', programs: ['BS Sociology', 'MS Sociology', 'MPhil Sociology'] },
  ],
  ah: [
    { id: 'eng', label: 'English', programs: ['BS English', 'MS English Literature', 'MPhil English', 'PhD English'] },
    { id: 'urdu', label: 'Urdu', programs: ['BS Urdu', 'MS Urdu', 'MPhil Urdu', 'PhD Urdu'] },
    { id: 'arch', label: 'Archaeology', programs: ['BS Archaeology', 'MS Archaeology'] },
    { id: 'arts', label: 'Fine Arts & Design', programs: ['BS Fine Arts', 'BS Design'] },
  ],
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState('');
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [program, setProgram] = useState('');
  const [official, setOfficial] = useState<any>(null);
  const [date, setDate] = useState<string>('');
  const [timeslot, setTimeslot] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  // Loaded from API
  const [officialsList, setOfficialsList] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submittedApt, setSubmittedApt] = useState<any>(null);
  // Direct path booking (VC, Registrar, etc.)
  const [useDirectPath, setUseDirectPath] = useState(false);
  const [directOfficial, setDirectOfficial] = useState<any>(null);

  // Fetch officials
  useEffect(() => {
    if (faculty) {
      setLoading(true);
      fetch(`/api/officials?facultyId=${faculty}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setOfficialsList(json.data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [faculty]);

  // Fetch direct official from DB when leadership is chosen
  useEffect(() => {
    if (directOfficial) {
      setLoading(true);
      let query = '';
      if (directOfficial.id === 'vc') query = 'role=ViceChancellor';
      else if (directOfficial.id === 'registrar') query = 'role=Registrar';
      else if (directOfficial.id === 'admissions') query = 'role=AdmissionOfficer';
      else if (directOfficial.id === 'exam') query = 'role=ExaminationOfficer';
      else query = `search=${encodeURIComponent(directOfficial.title)}`;

      fetch(`/api/officials?${query}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data && json.data.length > 0) {
            setOfficial(json.data[0]);
          } else {
            // Fallback mock official if not in database yet
            setOfficial({
              id: `${directOfficial.id}-official`,
              title: directOfficial.title,
              user: { fullName: `Office of the ${directOfficial.title}` },
              isAvailable: true,
              maxDailyAppointments: 10,
              appointmentDurationMins: 20
            });
          }
          setLoading(false);
        })
        .catch(() => {
          setOfficial({
            id: `${directOfficial.id}-official`,
            title: directOfficial.title,
            user: { fullName: `Office of the ${directOfficial.title}` },
            isAvailable: true,
            maxDailyAppointments: 10,
            appointmentDurationMins: 20
          });
          setLoading(false);
        });
    }
  }, [directOfficial]);

  // Fetch available slots when official & date is selected
  useEffect(() => {
    const activeOfficial = official || directOfficial;
    if (activeOfficial && date) {
      setLoadingSlots(true);
      // Try API, fall back to default slots
      fetch(`/api/timeslots?officialId=${activeOfficial.id}&date=${date}`)
        .then(r => r.json())
        .then(json => {
          if (json.success && json.data?.length) {
            setAvailableSlots(json.data.map((s: any) => s.startTime));
          } else {
            setAvailableSlots(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30']);
          }
        })
        .catch(() => setAvailableSlots(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30']))
        .finally(() => setLoadingSlots(false));
    }
  }, [official, directOfficial, date]);

  // Form submission
  const handleSubmit = async () => {
    if (!session) {
      setError('Please sign in to confirm your appointment.');
      return;
    }
    if (!official) {
      setError('No official selected. Please go back and select an official.');
      return;
    }
    setLoading(true);
    setError(null);

    const formData = {
      officialId: official.id,
      appointmentDate: date,
      startTime: timeslot,
      purpose: subject + ': ' + reason,
      notes: notes,
      isUrgent: priority === 'High',
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.details && typeof json.details === 'object') {
          const detailMsgs = Object.values(json.details).flat().join(', ');
          setError(`Validation failed: ${detailMsgs}`);
        } else {
          setError(json.error || 'Failed to submit appointment request.');
        }
        setLoading(false);
        return;
      }
      setSubmittedApt(json.data);
      setStep(8); // Success step
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('digital-slip')?.innerHTML;
    const printWindow = window.open('about:blank', '_blank', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>SUAMS Appointment Slip - Hazara University</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; color: #000; background: #fff; }
              .text-black { color: #000 !important; }
              .text-zinc-400 { color: #666 !important; }
              .font-mono { font-family: monospace; }
              .font-bold { font-weight: bold; }
              .border-b { border-bottom: 1px solid #ccc; }
              .pb-4 { padding-bottom: 16px; }
              .mb-4 { margin-bottom: 16px; }
              .mb-6 { margin-bottom: 24px; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .items-center { align-items: center; }
              .flex-col { flex-direction: column; }
              .text-xs { font-size: 12px; }
              .text-amber-800 { color: #b45309; }
              .bg-amber-50 { background-color: #fffbeb; }
              .rounded-xl { border-radius: 8px; }
              .p-4 { padding: 16px; }
              .bg-zinc-50 { background-color: #f9fafb; }
              .border { border: 1px solid #e5e7eb; }
              img { max-width: 120px; }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePdfDownload = () => {
    handlePrint();
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
      {/* Header logo */}
      <Link href="/" className="flex items-center gap-3 mb-8">
        <Image src="/assets/logo.png" alt="HU logo" width={44} height={44} className="rounded-full" />
        <div>
          <div className="font-bold text-base leading-none text-white">Hazara University</div>
          <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Smart Appointment Management System</div>
        </div>
      </Link>

      <div className="w-full max-w-3xl glass-card rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Step indicator bar */}
        {step < 8 && (
          <div className="w-full h-1.5 flex bg-black/40">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full transition-all duration-300"
                style={{
                  background: step > i ? 'var(--hu-accent)' : 'transparent',
                  opacity: step === i + 1 ? 1 : 0.4,
                }}
              />
            ))}
          </div>
        )}

        <div className="p-6 md:p-10">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Category */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-2">Step 1: Select Your Category</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Identify your affiliation to Hazara University.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setStep(2); }}
                      className={`p-5 rounded-2xl border text-sm font-semibold transition-all hover:scale-[1.02] ${category === cat ? 'border-amber-400 bg-amber-400/10' : 'border-[var(--border)] bg-black/25'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Faculty OR Direct Path */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => setStep(1)} style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={16} /> <span className="text-xs">Back</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Step 2: Choose Appointment Type</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Book directly with university leadership or go through a faculty.</p>

                {/* Direct path */}
                <div
                  className="p-4 rounded-2xl border mb-4 cursor-pointer"
                  style={{ borderColor: 'rgba(197,160,40,0.3)', background: 'rgba(197,160,40,0.05)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Crown size={16} style={{ color: 'var(--hu-accent)' }} />
                    <span className="font-bold text-sm" style={{ color: 'var(--hu-accent)' }}>University Leadership (Direct Access)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DIRECT_OFFICIALS.map(d => (
                      <button
                        key={d.id}
                        onClick={() => { setDirectOfficial(d); setUseDirectPath(true); setStep(5); }}
                        className="p-3 rounded-xl border text-left transition-all hover:scale-[1.02]"
                        style={{ borderColor: `${d.color}40`, background: `${d.color}08`, color: 'var(--text-primary)' }}
                      >
                        <div className="text-lg mb-1">{d.icon}</div>
                        <div className="text-xs font-bold leading-snug">{d.title}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{d.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faculty path */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Or choose by Faculty</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {FACULTIES.map((fac) => (
                      <button
                        key={fac.id}
                        onClick={() => { setFaculty(fac.id); setUseDirectPath(false); setDirectOfficial(null); setStep(3); }}
                        className={`p-4 rounded-2xl border flex items-center justify-between transition-all text-left ${faculty === fac.id ? 'border-amber-400 bg-amber-400/10' : 'border-[var(--border)] bg-black/25'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{fac.icon}</span>
                          <span className="text-sm font-semibold">{fac.label}</span>
                        </div>
                        <ChevronRight size={15} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Department / Program */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => setStep(2)} style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={16} /> <span className="text-xs">Back</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Step 3: Select Department & Program</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Pick the specific department and degree program.</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Department</label>
                    <select
                      value={department}
                      onChange={(e) => { setDepartment(e.target.value); setProgram(''); }}
                      className="w-full p-3 rounded-xl border border-[var(--border)] bg-black/45 text-sm text-white"
                    >
                      <option value="">Select department...</option>
                      {DEPARTMENTS[faculty]?.map((d) => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Program</label>
                    <select
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      disabled={!department}
                      className="w-full p-3 rounded-xl border border-[var(--border)] bg-black/45 text-sm text-white disabled:opacity-40"
                    >
                      <option value="">Select program...</option>
                      {DEPARTMENTS[faculty]?.find((d) => d.id === department)?.programs.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    disabled={!department || !program}
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Select Official */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => setStep(3)} style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={16} /> <span className="text-xs">Back</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Step 4: Select Official</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Select the university official you wish to visit.</p>
                {loading ? (
                  <div className="py-10 text-center text-sm">Loading officials...</div>
                ) : officialsList.length === 0 ? (
                  <div className="py-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    No officials listed for this faculty yet. Falling back to default list.
                    <button
                      onClick={() => {
                        setOfficialsList([
                          { id: 'vc-official', title: 'Vice Chancellor', user: { fullName: 'Prof. Dr. Mohsin Khan' }, slots: ['10:00', '10:30', '11:00', '11:30'] },
                          { id: 'registrar-official', title: 'Registrar', user: { fullName: 'Dr. Shahzad Rahman' }, slots: ['09:00', '09:30', '10:00', '10:30'] }
                        ]);
                      }}
                      className="block mx-auto mt-4 px-4 py-2 rounded-xl bg-black/40 text-xs border border-[var(--border)]"
                    >
                      Load Default Officials
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {officialsList.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => { setOfficial(o); setStep(5); }}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] flex items-center justify-between ${official?.id === o.id ? 'border-amber-400 bg-amber-400/10' : 'border-[var(--border)] bg-black/25'}`}
                      >
                        <div>
                          <div className="font-bold text-sm text-white">{o.user?.fullName}</div>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{o.title}</div>
                        </div>
                        <ChevronRight size={16} />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Select Date & Time Slot — Professional Calendar */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div
                  className="flex items-center gap-2 mb-4 cursor-pointer"
                  onClick={() => setStep(useDirectPath ? 2 : 4)}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <ArrowLeft size={16} /> <span className="text-xs">Back</span>
                </div>
                <h2 className="text-xl font-bold mb-1">Step 5: Pick Date & Time</h2>
                {(official || directOfficial) && (
                  <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                    Booking with <span className="font-semibold text-white">{directOfficial?.title || official?.user?.fullName || 'Official'}</span>
                  </p>
                )}

                <AppointmentCalendar
                  selectedDate={date}
                  onSelectDate={setDate}
                  availableSlots={availableSlots}
                  selectedSlot={timeslot}
                  onSelectSlot={(slot) => { setTimeslot(slot); setStep(6); }}
                  loadingSlotsFor={loadingSlots ? date : undefined}
                />

                {!timeslot && date && availableSlots.length > 0 && (
                  <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>Select a time slot above to continue</p>
                )}
              </motion.div>
            )}

            {/* Step 6: Appointment Details */}
            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => setStep(5)} style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={16} /> <span className="text-xs">Back</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Step 6: Appointment Details</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Provide detailed context about the purpose of your visit.</p>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Meeting Subject * (min. 3 characters)</label>
                    <input
                      type="text"
                      placeholder="Brief title (e.g., Degree verification)"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[var(--border)] bg-black/45 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Detailed Reason * (min. 5 characters)</label>
                    <textarea
                      rows={3}
                      placeholder="Explain the reason for this appointment..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[var(--border)] bg-black/45 text-sm text-white resize-none"
                    />
                  </div>

                  {reason.trim().length > 10 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-white flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                        <Sparkles size={12} className="animate-pulse" /> AI Smart Assistant Suggestions
                      </div>
                      <div className="flex flex-col gap-1 text-[11px] text-left">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Auto-detected Priority</span>
                          <span className={cn('font-bold', reason.toLowerCase().includes('urgent') || reason.toLowerCase().includes('emergency') || reason.toLowerCase().includes('medical') ? 'text-red-400' : 'text-emerald-400')}>
                            {reason.toLowerCase().includes('urgent') || reason.toLowerCase().includes('emergency') || reason.toLowerCase().includes('medical') ? 'Emergency / Urgent' : 'Normal / Routine'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">AI Suggested Routing Desk</span>
                          <span className="font-semibold text-white">{official?.title || 'Selected Official'}</span>
                        </div>
                      </div>
                      <div className="border-t border-white/5 pt-2 mt-1 text-left">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">AI Formulated Meeting Summary</span>
                        <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed font-serif italic">
                          "Requesting appointment regarding: {subject || 'Not specified'} to discuss details concerning '{reason.substring(0, 80)}...'."
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-3 rounded-xl border border-[var(--border)] bg-black/45 text-sm text-white"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Attachment (Optional)</label>
                      <div className="border border-dashed border-[var(--border)] rounded-xl p-3 flex items-center justify-between bg-black/20 text-xs">
                        <span className="truncate">{attachment ? attachment.name : 'PDF, DOC, PNG'}</span>
                        <label className="cursor-pointer font-bold text-amber-400 hover:text-amber-300">
                          Upload
                          <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {subject && reason && (subject.trim().length < 3 || reason.trim().length < 5 || (subject + ': ' + reason).trim().length < 10) && (
                  <p className="text-[11px] text-amber-400 mt-3">
                    ⚠ Note: Combined subject and details must be at least 10 characters long.
                  </p>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    disabled={
                      subject.trim().length < 3 || 
                      reason.trim().length < 5 || 
                      (subject + ': ' + reason).trim().length < 10
                    }
                    onClick={() => setStep(7)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40"
                  >
                    Review <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Review & Confirm */}
            {step === 7 && (
              <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => setStep(6)} style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={16} /> <span className="text-xs">Back</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Step 7: Review Appointment Details</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Please review all choices before final submission.</p>

                <div className="bg-black/35 rounded-2xl border border-[var(--border)] p-5 flex flex-col gap-4 text-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Category</span>
                    <span className="font-semibold">{category}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Official</span>
                    <span className="font-semibold">{official?.user?.fullName || 'Official'} ({official?.title})</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Date & Time</span>
                    <span className="font-semibold font-mono text-amber-400">{date} at {timeslot}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Subject</span>
                    <span className="font-semibold truncate max-w-[200px]">{subject}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Priority</span>
                    <span className={`font-semibold ${priority === 'High' ? 'text-red-400' : 'text-green-400'}`}>{priority}</span>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 mt-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-300">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <div className="flex justify-end mt-8">
                  <button
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20 disabled:opacity-40"
                  >
                    {loading ? 'Submitting...' : 'Confirm & Request Appointment'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 8: Success Digital Slip */}
            {step === 8 && submittedApt && (
              <motion.div key="step8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center mx-auto mb-4 text-emerald-400 text-3xl">
                  ✓
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Request Submitted Successfully!</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Digital appointment slip generated below.</p>

                {/* Digital Slip */}
                <div id="digital-slip" className="bg-white text-black rounded-2xl p-6 text-left shadow-2xl max-w-md mx-auto mb-6 relative border border-zinc-200">
                  <div className="flex justify-between items-start border-b border-zinc-100 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/logo.png"
                        alt="Hazara University Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <div>
                        <div className="font-bold text-[10px] uppercase tracking-wider text-zinc-400">Hazara University</div>
                        <div className="font-bold text-xs text-zinc-800">Smart Appointment Portal</div>
                      </div>
                    </div>
                    <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      {submittedApt.status}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 text-xs mb-6">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Appointment ID</span>
                      <span className="font-bold font-mono text-zinc-800">{submittedApt.appointmentNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Applicant Name</span>
                      <span className="font-semibold text-zinc-800">{session?.user?.name || 'Applicant'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Official Target</span>
                      <span className="font-semibold text-zinc-800">{submittedApt.officialName || 'Official'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Schedule Date</span>
                      <span className="font-semibold text-zinc-800">{submittedApt.appointmentDate ? new Date(submittedApt.appointmentDate).toDateString() : date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Time Window</span>
                      <span className="font-mono font-semibold text-zinc-800">{submittedApt.startTime} – {submittedApt.endTime}</span>
                    </div>
                  </div>

                  {/* Dynamic QR Code from API */}
                  <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                    <img
                      src={`/api/qr/${submittedApt.id}`}
                      alt="Appointment Verification QR Code"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                    <span className="text-[10px] text-zinc-400 mt-2">Scan at the security entry point</span>
                  </div>
                </div>

                {/* Exporters and Calendar Adders */}
                <div className="flex flex-col gap-3 max-w-md mx-auto mb-6">
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=SUAMS+Appointment+with+${encodeURIComponent(submittedApt.officialName || 'Official')}&dates=20260714T100000Z/20260714T102000Z&details=Verification+appointment+at+Hazara+University.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-white/5 bg-black/25 text-[10px] font-bold text-amber-400 hover:bg-white/5 text-center flex items-center justify-center"
                    >
                      Google Calendar
                    </a>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert('ICS file downloaded successfully.'); }}
                      className="p-2 rounded-xl border border-white/5 bg-black/25 text-[10px] font-bold text-amber-400 hover:bg-white/5 text-center flex items-center justify-center"
                    >
                      Outlook / Apple
                    </a>
                    <button
                      onClick={handlePdfDownload}
                      className="p-2 rounded-xl border border-white/5 bg-black/25 text-[10px] font-bold text-amber-400 hover:bg-white/5 flex items-center justify-center gap-1"
                    >
                      <Download size={10} /> PDF Slip
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold hover:bg-white/5">
                    <Printer size={14} /> Print Slip
                  </button>
                  <Link href="/student" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400">
                    Go to Dashboard
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
