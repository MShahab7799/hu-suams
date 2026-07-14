'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, getSession } from 'next-auth/react';
import {
  Eye, EyeOff, User, Mail, Phone, Lock, AlertCircle,
  UserPlus, ChevronDown, CheckCircle2,
} from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { getDashboardPath } from '@/lib/permissions';
import type { UserRole } from '@/types';

const ROLES: { value: UserRole; label: string; icon: string }[] = [
  { value: 'Student',            label: 'Student',              icon: '👨‍🎓' },
  { value: 'Teacher',            label: 'Teacher / Faculty',    icon: '👩‍🏫' },
  { value: 'Parent',             label: 'Parent / Guardian',    icon: '👨‍👩‍👧' },
  { value: 'Alumni',             label: 'Alumni',               icon: '🎖️' },
  { value: 'Visitor',            label: 'Visitor',              icon: '🚶' },
  { value: 'ViceChancellor',     label: 'Vice Chancellor',      icon: '🎓' },
  { value: 'Registrar',          label: 'Registrar',            icon: '📋' },
  { value: 'Dean',               label: 'Dean',                 icon: '🏛️' },
  { value: 'Chairman',           label: 'Chairman',             icon: '📌' },
  { value: 'HOD',                label: 'Head of Department',   icon: '👨‍🏫' },
  { value: 'Director',           label: 'Director',             icon: '🏢' },
  { value: 'Assistant',          label: 'Assistant',            icon: '📁' },
  { value: 'AdmissionOfficer',   label: 'Admission Officer',    icon: '📝' },
  { value: 'ExaminationOfficer', label: 'Examination Officer',  icon: '📊' },
  { value: 'Admin',              label: 'Administrator',        icon: '🛡️' },
];

const GENDERS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'PreferNotToSay', label: 'Prefer not to say' },
];

const FACULTIES = [
  { value: 'ncs', label: 'Natural & Computational Sciences' },
  { value: 'bhs', label: 'Biological & Health Sciences' },
  { value: 'lss', label: 'Law & Social Sciences' },
  { value: 'ah', label: 'Arts & Humanities' },
];

const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);

// ── Input Component ──────────────────────────────────────────
function FormInput({
  id, label, error, icon: Icon, required, ...props
}: {
  id: string; label: string; error?: string; icon?: any; required?: boolean;
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        {label}{required && <span style={{ color: 'var(--hu-accent)' }}> *</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        )}
        <input
          id={id}
          {...props}
          className="w-full py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            paddingLeft: Icon ? '2.5rem' : '1rem',
            paddingRight: props.type === 'password' ? '3rem' : '1rem',
            background: 'var(--surface)',
            border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : focused ? 'var(--hu-primary-light)' : 'var(--border)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(27,77,62,0.2)' : 'none',
            color: 'var(--text-primary)',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      {error && <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>{error}</p>}
    </div>
  );
}

// ── Select Component ──────────────────────────────────────────
function FormSelect({ id, label, error, children, required, ...props }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
        {label}{required && <span style={{ color: 'var(--hu-accent)' }}> *</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          {...props}
          className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none appearance-none cursor-pointer transition-all"
          style={{
            background: 'var(--surface)',
            border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : focused ? 'var(--hu-primary-light)' : 'var(--border)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(27,77,62,0.2)' : 'none',
            color: 'var(--text-primary)',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {children}
        </select>
        <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
      </div>
      {error && <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>{error}</p>}
    </div>
  );
}

// ── Password Strength ─────────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'];
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score] : 'var(--border)' }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: score > 0 ? colors[score] : 'var(--text-muted)' }}>
          {labels[score]}
        </p>
        <div className="flex gap-2">
          {checks.map((c, i) => (
            <span key={i} className="text-xs" style={{ color: c.ok ? '#22C55E' : 'var(--text-muted)' }}>
              {c.ok ? '✓' : '○'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Register Page ────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // Multi-step: 1=Personal, 2=Academic, 3=Security

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'Student', gender: 'Male' },
  });

  const password = watch('password', '');
  const role = watch('role');
  const isStudent = role === 'Student' || role === 'Teacher';
  const needsFaculty = ['Dean', 'Chairman', 'HOD', 'Director', 'Student', 'Teacher'].includes(role);

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.error || 'Registration failed. Please try again.');
        return;
      }

      setSuccess(true);

      // Auto-login: sign in with the registered credentials
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Auto-login failed — redirect to login page as fallback
        setTimeout(() => router.push('/login?registered=1'), 1800);
        return;
      }

      // Get session to determine dashboard path
      const session = await getSession();
      const role = (session?.user as any)?.role as UserRole | undefined;
      const dashboardPath = role ? getDashboardPath(role) : '/student';
      setTimeout(() => router.push(dashboardPath), 1500);
    } catch {
      setServerError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Redirecting you to sign in...
        </p>
      </motion.div>
    );
  }

  const nextStep = async () => {
    const fields: (keyof RegisterInput)[][] = [
      ['fullName', 'email', 'mobileNumber', 'cnic', 'gender'],
      ['role', 'universityId', 'facultyId'],
      ['password', 'confirmPassword'],
    ];
    const ok = await trigger(fields[step - 1]);
    if (ok) setStep(step + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Create Account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Join Hazara University's smart appointment platform
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-7">
        {['Personal Info', 'Academic Info', 'Security'].map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0"
              style={{
                background: step > i + 1 ? 'var(--hu-primary-light)' : step === i + 1 ? 'var(--hu-accent)' : 'var(--surface)',
                color: step >= i + 1 ? '#000' : 'var(--text-muted)',
                border: `1px solid ${step >= i + 1 ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className="text-xs hidden sm:block" style={{ color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {s}
            </span>
            {i < 2 && <div className="flex-1 h-px" style={{ background: step > i + 1 ? 'var(--hu-primary-light)' : 'var(--border)' }} />}
          </div>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl mb-5 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              <FormInput id="fullName" label="Full Name" required icon={User} type="text" autoComplete="name" placeholder="Muhammad Ali Khan" error={errors.fullName?.message} {...register('fullName')} />
              <FormInput id="email" label="Email Address" required icon={Mail} type="email" autoComplete="email" placeholder="student@hu.edu.pk" error={errors.email?.message} {...register('email')} />
              <div className="grid grid-cols-2 gap-4">
                <FormInput id="mobileNumber" label="Mobile Number" icon={Phone} type="tel" placeholder="+923001234567" error={errors.mobileNumber?.message} {...register('mobileNumber')} />
                <FormInput id="cnic" label="CNIC (Optional)" type="text" placeholder="12345-1234567-1" error={errors.cnic?.message} {...register('cnic')} />
              </div>
              <FormSelect id="gender" label="Gender" required error={errors.gender?.message} {...register('gender')}>
                {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </FormSelect>
            </motion.div>
          )}

          {/* ── STEP 2: Academic Info ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              <FormSelect id="role" label="Role / Position" required error={errors.role?.message} {...register('role')}>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
              </FormSelect>
              <FormInput id="universityId" label="University ID (Optional)" type="text" placeholder="e.g. 2023-CS-001" error={errors.universityId?.message} {...register('universityId')} />
              {needsFaculty && (
                <FormSelect id="facultyId" label="Faculty" error={errors.facultyId?.message} {...register('facultyId')}>
                  <option value="">Select faculty...</option>
                  {FACULTIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </FormSelect>
              )}
              {isStudent && (
                <FormSelect id="semester" label="Current Semester" error={errors.semester?.message as string} {...register('semester', { valueAsNumber: true })}>
                  <option value="">Select semester...</option>
                  {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </FormSelect>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Security ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Password <span style={{ color: 'var(--hu-accent)' }}>*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    {...register('password')}
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--surface)', border: `1px solid ${errors.password ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`, color: 'var(--text-primary)' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--hu-primary-light)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,77,62,0.2)'; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.5)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>{errors.password.message}</p>}
                <PasswordStrength password={password} />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Confirm Password <span style={{ color: 'var(--hu-accent)' }}>*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    {...register('confirmPassword')}
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--surface)', border: `1px solid ${errors.confirmPassword ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`, color: 'var(--text-primary)' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--hu-primary-light)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,77,62,0.2)'; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.confirmPassword ? 'rgba(239,68,68,0.5)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>{errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl text-xs"
                style={{ background: 'rgba(197,160,40,0.05)', border: '1px solid rgba(197,160,40,0.15)', color: 'var(--text-secondary)' }}
              >
                <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--hu-accent)' }} />
                By creating an account, you agree to our{' '}
                <Link href="#" style={{ color: 'var(--hu-accent)' }}>Terms of Use</Link> and{' '}
                <Link href="#" style={{ color: 'var(--hu-accent)' }}>Privacy Policy</Link> of Hazara University.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <motion.button
              type="button"
              onClick={nextStep}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 py-3.5 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff', boxShadow: '0 4px 20px rgba(27,77,62,0.5)' }}
            >
              Continue →
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, var(--hu-accent-light, #E8C048), var(--hu-accent))', color: '#000', boxShadow: '0 4px 20px rgba(197,160,40,0.4)' }}
            >
              {isLoading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />Creating account...</>
              ) : (
                <><UserPlus size={16} />Create Account</>
              )}
            </motion.button>
          )}
        </div>
      </form>

      {/* Sign in link */}
      <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold" style={{ color: 'var(--hu-accent)' }}>
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
