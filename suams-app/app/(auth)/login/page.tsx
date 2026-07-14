'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, getSession } from 'next-auth/react';
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { getDashboardPath } from '@/lib/permissions';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError('Invalid email or password. Please try again.');
        return;
      }

      // Fetch fresh session to get role, then redirect to the correct dashboard
      const session = await getSession();
      const role = (session?.user as any)?.role as UserRole | undefined;
      const dashboardPath = role ? getDashboardPath(role) : '/student';
      router.push(dashboardPath);
      router.refresh();
    } catch {
      setAuthError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome back 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Sign in to your Hazara University account
        </p>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {authError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl mb-6 text-sm"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5',
            }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            {authError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold mb-2 uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="your@hu.edu.pk"
              {...register('email')}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${errors.email ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--hu-primary-light)';
                e.target.style.boxShadow = '0 0 0 3px rgba(27,77,62,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.5)' : 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          {errors.email && (
            <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium transition-colors"
              style={{ color: 'var(--hu-accent)' }}
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password')}
              className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${errors.password ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--hu-primary-light)';
                e.target.style.boxShadow = '0 0 0 3px rgba(27,77,62,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.password ? 'rgba(239,68,68,0.5)' : 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs mt-1.5" style={{ color: '#FCA5A5' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 mb-6">
          <input
            id="remember-me"
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 rounded"
            style={{ accentColor: 'var(--hu-primary-light)' }}
          />
          <label htmlFor="remember-me" className="text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.01, y: isLoading ? 0 : -1 }}
          whileTap={{ scale: isLoading ? 1 : 0.99 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, var(--hu-primary-light) 0%, var(--hu-primary) 100%)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(27,77,62,0.5)',
          }}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={16} />
              Sign in to Dashboard
            </>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {/* Continue as guest */}
      <Link
        href="/appointments"
        className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-sm font-medium transition-all"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-secondary)',
        }}
      >
        👤 Continue as Guest
      </Link>

      {/* Register link */}
      <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold transition-colors"
          style={{ color: 'var(--hu-accent)' }}
        >
          Create account
        </Link>
      </p>
    </motion.div>
  );
}
