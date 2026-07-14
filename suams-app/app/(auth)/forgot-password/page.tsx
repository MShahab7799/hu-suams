'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email', '');

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to send reset email'); return; }
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Link href="/login" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={14} /> Back to Sign In
      </Link>

      {!submitted ? (
        <>
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5" style={{ background: 'rgba(197,160,40,0.1)', border: '1px solid rgba(197,160,40,0.2)' }}>🔑</div>
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Enter your email and we&apos;ll send a reset link.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl mb-5 text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>
                <AlertCircle size={16} className="flex-shrink-0" />{error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-5">
              <label htmlFor="fp-email" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="fp-email" type="email" autoComplete="email" placeholder="your@hu.edu.pk"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--surface)', border: `1px solid ${errors.email ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`, color: 'var(--text-primary)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--hu-primary-light)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,77,62,0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.5)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {errors.email && <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>{errors.email.message}</p>}
            </div>

            <motion.button
              type="submit" disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff', boxShadow: '0 4px 20px rgba(27,77,62,0.5)' }}
            >
              {isLoading
                ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Sending...</>
                : <><Send size={16} />Send Reset Link</>
              }
            </motion.button>
          </form>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle2 size={32} style={{ color: '#22C55E' }} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Check your email</h2>
          <p className="mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            We sent a password reset link to
          </p>
          <p className="font-mono text-sm font-semibold mb-6" style={{ color: 'var(--hu-accent)' }}>{email}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Didn&apos;t receive it? Check spam, or{' '}
            <button onClick={() => setSubmitted(false)} className="font-medium" style={{ color: 'var(--hu-accent)' }}>try again</button>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
