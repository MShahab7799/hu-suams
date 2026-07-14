'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations';

import { Suspense } from 'react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
    }
  });

  // Keep token synced from URL search query parameter
  useEffect(() => {
    if (token) {
      setValue('token', token);
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to reset password. Token may be invalid or expired.');
        return;
      }
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

      {!token ? (
        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertCircle size={32} className="mx-auto mb-3 text-red-400" />
          <h2 className="text-xl font-bold mb-2">Invalid Token</h2>
          <p className="text-sm text-zinc-400">Password reset token is missing from the link URL.</p>
        </div>
      ) : !submitted ? (
        <>
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5" style={{ background: 'rgba(197,160,40,0.1)', border: '1px solid rgba(197,160,40,0.2)' }}>🔐</div>
            <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Define a strong, secure new password for your SUAMS portal access.
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

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <input type="hidden" {...register('token')} />

            <div>
              <label htmlFor="rp-password" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                New Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="rp-password" type="password" placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--surface)', border: `1px solid ${errors.password ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`, color: 'var(--text-primary)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--hu-primary-light)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,77,62,0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.5)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {errors.password && <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="rp-confirm-password" className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="rp-confirm-password" type="password" placeholder="••••••••"
                  {...register('confirmPassword')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--surface)', border: `1px solid ${errors.confirmPassword ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`, color: 'var(--text-primary)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--hu-primary-light)'; e.target.style.boxShadow = '0 0 0 3px rgba(27,77,62,0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.confirmPassword ? 'rgba(239,68,68,0.5)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>{errors.confirmPassword.message}</p>}
            </div>

            <motion.button
              type="submit" disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01, y: isLoading ? 0 : -1 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff', boxShadow: '0 4px 20px rgba(27,77,62,0.5)' }}
            >
              {isLoading
                ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Resetting...</>
                : 'Reset Password'
              }
            </motion.button>
          </form>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle2 size={32} style={{ color: '#22C55E' }} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Password Changed!</h2>
          <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your password has been successfully updated. You can now log in with your new credentials.
          </p>
          <Link
            href="/login"
            className="w-full flex items-center justify-center py-3 px-6 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, var(--hu-primary-light), var(--hu-primary))', color: '#fff' }}
          >
            Sign In Now
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm">Loading reset form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
