'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Users, Award, ArrowRight, LogIn, CheckCircle,
  ChevronDown, ChevronUp, Mail, Phone, MapPin, Clock,
  BookOpen, GraduationCap, Building2, Star, Shield, Zap,
  FileCheck, Bell, UserCheck, MessageSquare
} from 'lucide-react';

// ── Animated Counter ────────────────────────────────────────
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────
function SectionHeader({ badge, title, subtitle }: { badge: string; title: React.ReactNode; subtitle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-14"
    >
      <span
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
        style={{ background: 'rgba(197,160,40,0.1)', border: '1px solid rgba(197,160,40,0.25)', color: 'var(--hu-accent)' }}
      >
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4 leading-tight">{title}</h2>
      <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
    </motion.div>
  );
}

// ── Data ─────────────────────────────────────────────────────
const STATS = [
  { label: 'Students Enrolled', value: 12000, suffix: '+', icon: GraduationCap, color: '#4ade80' },
  { label: 'Programs Offered',  value: 41,    suffix: '+', icon: BookOpen,      color: '#60a5fa' },
  { label: 'Faculty Members',   value: 250,   suffix: '+', icon: Users,         color: '#f59e0b' },
  { label: 'Faculties',         value: 4,     suffix: '',  icon: Building2,     color: '#c084fc' },
];

const FACULTIES = [
  {
    id: 'ncs', icon: '⚛️', color: '#3b82f6',
    name: 'Natural & Computational Sciences',
    programs: ['BS Computer Science', 'BS Software Engineering', 'BS AI', 'BS IT', 'MS Computer Science', 'PhD Computer Science', 'BS Mathematics', 'BS Physics', 'BS Chemistry'],
  },
  {
    id: 'bhs', icon: '🧬', color: '#10b981',
    name: 'Biological & Health Sciences',
    programs: ['BS Botany', 'BS Zoology', 'BS Biotechnology', 'Doctor of Pharmacy (Pharm-D)', 'MS Botany', 'MS Zoology', 'PhD Botany'],
  },
  {
    id: 'lss', icon: '⚖️', color: '#f59e0b',
    name: 'Law & Social Sciences',
    programs: ['BBA', 'BS Economics', 'BS Psychology', 'BS Sociology', 'LLB (5 Years)', 'MBA', 'MS Economics', 'MPhil Sociology'],
  },
  {
    id: 'ah', icon: '🎨', color: '#ec4899',
    name: 'Arts & Humanities',
    programs: ['BS English', 'BS Urdu', 'BS Archaeology', 'BS Fine Arts', 'MS English Literature', 'MPhil Urdu'],
  },
];

const WORKFLOW_STEPS = [
  { step: '01', icon: UserCheck, title: 'Create Your Account', desc: 'Register with your university email and complete your academic profile in minutes.' },
  { step: '02', icon: CalendarDays, title: 'Book an Appointment', desc: 'Choose your official, select an available date and time slot from the live calendar.' },
  { step: '03', icon: Bell, title: 'Get Instant Confirmation', desc: 'Receive real-time notifications when your appointment is approved, rescheduled, or updated.' },
  { step: '04', icon: FileCheck, title: 'Attend & Get Verified', desc: 'Show your digital QR-code pass at the office. Your visit is logged securely.' },
];

const TESTIMONIALS = [
  { name: 'Ahmad Bilal', role: 'BS CS — 6th Semester', text: 'Booking a meeting with the Chairman used to take days. Now I get a confirmed slot in under two minutes. Absolutely game-changing!', stars: 5 },
  { name: 'Sana Noor', role: 'MS Botany — 2nd Semester', text: 'The QR pass system is brilliant. I walked in, scanned my code, and was seen immediately. No queue, no confusion.', stars: 5 },
  { name: 'Prof. Kashif Ullah', role: 'Head of Department, Economics', text: 'As an HOD, managing student meetings was chaotic. This dashboard gives me full control over my schedule and reduces no-shows significantly.', stars: 5 },
];

const FAQS = [
  { q: 'Who can use the Hazara University Appointment System?', a: 'Any student, teacher, parent, alumni, or visitor can register and book an appointment. University officials including the Vice Chancellor, Registrar, Deans, and Chairmen are all available through the system.' },
  { q: 'Is my personal data secure?', a: 'Yes. All data is encrypted and stored securely on university servers. We comply with institutional data protection standards. Only authorized staff can view appointment details.' },
  { q: 'Can I reschedule or cancel an appointment?', a: 'Yes. You can cancel or request a reschedule any time before the appointment. The official will be notified automatically and you can re-book a new slot.' },
  { q: 'What if I cannot attend my appointment?', a: 'Please cancel at least 1 hour before. Repeated no-shows may result in temporary booking restrictions. You will receive reminder notifications 24 hours and 1 hour before your slot.' },
  { q: 'Can I book appointments with the Vice Chancellor directly?', a: 'Yes. There is a dedicated "University Leadership" category in the booking wizard which includes the VC, Registrar, Admissions Office, and Controller of Examinations.' },
  { q: 'How long does approval take?', a: 'Most appointments are reviewed within a few hours during working days (Mon–Fri). The official or their assistant will approve, reschedule, or reject with a reason. You will be notified by the system instantly.' },
];

// ── FAQ Item ─────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${open ? 'rgba(197,160,40,0.35)' : 'var(--border)'}`, background: open ? 'rgba(197,160,40,0.04)' : 'var(--glass-bg)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>{q}</span>
        <span className="flex-shrink-0" style={{ color: 'var(--hu-accent)' }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 md:px-12 h-[70px]"
        style={{ background: 'rgba(8,14,18,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}
      >
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden" style={{ border: '2px solid rgba(197,160,40,0.4)' }}>
            <Image src="/assets/logo.png" alt="HU Logo" width={40} height={40} className="rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div>
            <span className="block font-bold text-sm text-white leading-tight">Hazara University</span>
            <span className="block text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>Mansehra · Est. 2001</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {[{ label: 'About', href: '#about' }, { label: 'Faculties', href: '#faculties' }, { label: 'How it Works', href: '#how-it-works' }, { label: 'FAQ', href: '#faq' }, { label: 'Contact', href: '#contact' }].map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>{l.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:bg-white/8 border border-white/8">
            <LogIn size={14} /> Sign In
          </Link>
          <Link
            href="/appointments"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, var(--hu-accent-light, #E8C048), var(--hu-accent))', color: '#000', boxShadow: '0 4px 20px rgba(197,160,40,0.3)' }}
          >
            Book Appointment <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 md:px-12" id="about">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(27,77,62,0.18) 0%, transparent 65%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(197,160,40,0.08) 0%, transparent 65%)', borderRadius: '50%' }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <motion.span
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                style={{ background: 'rgba(197,160,40,0.1)', border: '1px solid rgba(197,160,40,0.25)', color: 'var(--hu-accent)' }}
              >
                🎓 Official Portal of Hazara University
              </motion.span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-[1.1] mb-6 text-white">
                Smart{' '}
                <span className="gradient-text">Appointment</span>
                <br />Management
                <br />
                <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>for Hazara University</span>
              </h1>

              <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)', maxWidth: '520px' }}>
                Schedule meetings with the Vice Chancellor, Registrar, Deans, Chairmen, HODs,
                Admissions, and Examination offices — all from one secure digital hub.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  href="/appointments"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all"
                  style={{ background: 'linear-gradient(135deg, var(--hu-accent-light, #E8C048), var(--hu-accent))', color: '#000', boxShadow: '0 6px 30px rgba(197,160,40,0.35)' }}
                >
                  <CalendarDays size={16} /> Book an Appointment
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text-primary)' }}
                >
                  <LogIn size={16} /> Portal Login
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-5">
                {[
                  { icon: Shield, label: 'Secure & Encrypted' },
                  { icon: Zap, label: 'Real-time Notifications' },
                  { icon: CheckCircle, label: 'Role-based Access' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Icon size={14} style={{ color: 'var(--hu-accent)' }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              {/* Main card */}
              <div
                className="relative rounded-3xl p-8 overflow-hidden"
                style={{ background: 'linear-gradient(145deg, rgba(27,77,62,0.3), rgba(15,25,35,0.8))', border: '1px solid rgba(27,77,62,0.4)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
              >
                {/* Decorative header */}
                <div className="flex items-center gap-3 mb-8 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-10 h-10 rounded-xl overflow-hidden" style={{ border: '2px solid rgba(197,160,40,0.4)' }}>
                    <Image src="/assets/logo.png" alt="HU" width={40} height={40} className="rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">SUAMS Dashboard</div>
                    <div className="text-xs" style={{ color: 'var(--hu-accent)' }}>● Live System</div>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>Active</span>
                  </div>
                </div>

                {/* Mock appointment cards */}
                {[
                  { name: 'Prof. Dr. Mohsin Ali Khan', role: 'Vice Chancellor', time: 'Today · 10:00 AM', status: 'Approved', statusColor: '#4ade80', bg: 'rgba(34,197,94,0.08)' },
                  { name: 'Dr. Naveed Ahmad', role: 'Dean — NCS Faculty', time: 'Tomorrow · 2:30 PM', status: 'Pending', statusColor: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
                  { name: 'Admissions Office', role: 'Admission Officer', time: 'Wed · 11:00 AM', status: 'Confirmed', statusColor: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.12 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl mb-3"
                    style={{ background: card.bg, border: `1px solid ${card.statusColor}25` }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: `${card.statusColor}20`, color: card.statusColor }}
                    >
                      {card.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{card.name}</div>
                      <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{card.role}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{card.time}</div>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={{ background: `${card.statusColor}20`, color: card.statusColor }}
                    >
                      {card.status}
                    </span>
                  </motion.div>
                ))}

                {/* Bottom stats row */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {[{ label: 'This Week', value: '3' }, { label: 'Approved', value: '2' }, { label: 'Pending', value: '1' }].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="text-xl font-bold text-white">{s.value}</div>
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl"
                style={{ background: 'linear-gradient(135deg, var(--hu-accent), #a07010)', color: '#000' }}
              >
                🎓 HU Official Portal
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => {
            const Icon = s.icon;
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true });
            return (
              <motion.div
                key={s.label}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-center flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <div className="text-3xl font-bold text-white font-display">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs uppercase font-semibold tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="📋 Simple 4-Step Process"
            title={<>How It <span className="gradient-text">Works</span></>}
            subtitle="From registration to confirmed appointment — get started in under 5 minutes."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: '-60px' });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative p-6 rounded-3xl flex flex-col gap-4"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(27,77,62,0.5), rgba(27,77,62,0.2))', border: '1px solid rgba(27,77,62,0.5)' }}>
                      <Icon size={20} style={{ color: 'var(--hu-primary-light)' }} />
                    </div>
                    <span className="text-3xl font-black font-display" style={{ color: 'rgba(255,255,255,0.06)' }}>{step.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                  {i < WORKFLOW_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight size={16} style={{ color: 'var(--hu-accent)' }} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all"
              style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff', boxShadow: '0 6px 30px rgba(27,77,62,0.4)' }}
            >
              Start Booking Now <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FACULTIES ────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12" style={{ background: 'var(--bg-2)' }} id="faculties">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="🏛️ Academic Excellence"
            title={<>Our <span className="gradient-text-green">Faculties</span></>}
            subtitle="Hazara University offers undergraduate, graduate, and postgraduate programs across four faculties."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {FACULTIES.map((f, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: '-60px' });
              return (
                <motion.div
                  key={f.id}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group p-6 rounded-3xl transition-all hover:scale-[1.01] cursor-default"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">Faculty of {f.name}</h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{f.programs.length} programs offered</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {f.programs.slice(0, 6).map((p) => (
                      <span key={p} className="text-[11px] px-2.5 py-1 rounded-lg font-medium" style={{ background: `${f.color}12`, color: f.color, border: `1px solid ${f.color}22` }}>{p}</span>
                    ))}
                    {f.programs.length > 6 && (
                      <span className="text-[11px] px-2.5 py-1 rounded-lg font-medium" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>+{f.programs.length - 6} more</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="💬 Student & Faculty Reviews"
            title={<>Trusted by the <span className="gradient-text">HU Community</span></>}
            subtitle="See what students and faculty say about the smart appointment system."
          />

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="p-8 md:p-10 rounded-3xl text-center"
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
              >
                <div className="flex justify-center mb-4">
                  {Array.from({ length: TESTIMONIALS[activeTestimonial].stars }).map((_, i) => (
                    <Star key={i} size={18} fill="#f59e0b" stroke="none" />
                  ))}
                </div>
                <blockquote className="text-base md:text-lg leading-relaxed mb-6 italic" style={{ color: 'var(--text-primary)' }}>
                  "{TESTIMONIALS[activeTestimonial].text}"
                </blockquote>
                <div>
                  <div className="font-bold text-white">{TESTIMONIALS[activeTestimonial].name}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{TESTIMONIALS[activeTestimonial].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className="h-2 rounded-full transition-all"
                  style={{ width: i === activeTestimonial ? '24px' : '8px', background: i === activeTestimonial ? 'var(--hu-accent)' : 'var(--border)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12" style={{ background: 'var(--bg-2)' }} id="faq">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            badge="❓ Common Questions"
            title={<>Frequently Asked <span className="gradient-text">Questions</span></>}
            subtitle="Everything you need to know about the Hazara University appointment system."
          />
          <div className="flex flex-col gap-3">
            {FAQS.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12" id="contact">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="📍 Get in Touch"
            title={<>Contact <span className="gradient-text">Hazara University</span></>}
            subtitle="Need help? Reach out to the university office or visit us on campus."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'Campus Address', info: 'Hazara University Mansehra, KPK, Pakistan', sub: 'Dhodial, Mansehra 21300' },
              { icon: Phone, title: 'Phone Numbers', info: '+92-997-530317', sub: 'Mon–Fri: 8:00 AM – 4:00 PM' },
              { icon: Mail, title: 'Email Address', info: 'registrar@hu.edu.pk', sub: 'info@hazarauniversity.edu.pk' },
            ].map(({ icon: Icon, title, info, sub }, i) => {
              const ref = useRef<HTMLDivElement>(null);
              const inView = useInView(ref, { once: true, margin: '-40px' });
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center p-8 rounded-3xl"
                  style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(27,77,62,0.3)', border: '1px solid rgba(27,77,62,0.4)' }}>
                    <Icon size={22} style={{ color: 'var(--hu-primary-light)' }} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{info}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12" style={{ background: 'linear-gradient(135deg, var(--hu-primary-dark) 0%, #0a2018 100%)', borderTop: '1px solid rgba(27,77,62,0.4)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Ready to book your first appointment?
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of Hazara University students and staff managing appointments digitally.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all"
              style={{ background: 'linear-gradient(135deg, var(--hu-accent-light, #E8C048), var(--hu-accent))', color: '#000', boxShadow: '0 6px 30px rgba(197,160,40,0.4)' }}
            >
              Create Account <ArrowRight size={15} />
            </Link>
            <Link
              href="/appointments"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold border transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)' }}
            >
              Book as Guest
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden" style={{ border: '2px solid rgba(197,160,40,0.4)' }}>
                  <Image src="/assets/logo.png" alt="HU" width={40} height={40} className="rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Hazara University</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Mansehra, KPK · Est. 2001</div>
                </div>
              </Link>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '320px' }}>
                The Smart University Appointment Management System (SUAMS) — a digital platform
                for managing academic appointments at Hazara University.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Quick Links</h4>
              <div className="flex flex-col gap-2.5">
                {[{ label: 'Book Appointment', href: '/appointments' }, { label: 'Student Portal', href: '/login' }, { label: 'Official Login', href: '/login' }, { label: 'Register Account', href: '/register' }].map(l => (
                  <Link key={l.label} href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>{l.label}</Link>
                ))}
              </div>
            </div>

            {/* Faculties */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Faculties</h4>
              <div className="flex flex-col gap-2.5">
                {['Natural & Computational Sciences', 'Biological & Health Sciences', 'Law & Social Sciences', 'Arts & Humanities'].map(f => (
                  <span key={f} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Hazara University Mansehra. All Rights Reserved.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              SUAMS — Smart University Appointment Management System · Final Year Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
