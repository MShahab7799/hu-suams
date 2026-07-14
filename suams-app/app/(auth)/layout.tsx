'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  { icon: '⚡', text: 'Book appointments with any university official instantly' },
  { icon: '🔔', text: 'Get real-time notifications for approval and reminders' },
  { icon: '📊', text: 'Personal dashboard to track all your appointments' },
  { icon: '🔒', text: 'Enterprise-grade security for your data' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* ── Left Branding Panel ─────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col w-[460px] xl:w-[520px] flex-shrink-0 relative overflow-hidden p-10 xl:p-12"
        style={{
          background: 'linear-gradient(145deg, var(--hu-primary-dark) 0%, #0A1E16 50%, var(--bg) 100%)',
        }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gold glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(197,160,40,0.12) 0%, transparent 60%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(27,77,62,0.3) 0%, transparent 60%)',
            transform: 'translate(-30%, 30%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
              style={{ border: '2px solid rgba(197,160,40,0.4)', boxShadow: 'var(--shadow-gold)' }}
            >
              <Image
                src="/assets/logo.png"
                alt="Hazara University"
                width={48} height={48}
                className="rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Hazara University
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                Mansehra, KPK · Est. 2001
              </div>
            </div>
          </Link>

          {/* Main tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 flex flex-col justify-center"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: 'rgba(197,160,40,0.1)',
                border: '1px solid rgba(197,160,40,0.25)',
                color: 'var(--hu-accent)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
            >
              🎓 Smart Appointment System
            </div>

            <h1
              className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Your Gateway to{' '}
              <span className="gradient-text-green">Smart</span>{' '}
              Appointments
            </h1>

            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              Hazara University's digital appointment portal — connect with university officials
              quickly, securely, and hassle-free.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div
                    className="w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center text-sm"
                    style={{
                      background: 'rgba(27,77,62,0.35)',
                      border: '1px solid rgba(27,77,62,0.5)',
                    }}
                  >
                    {f.icon}
                  </div>
                  <span>{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer quote */}
          <div
            className="border-t pt-6 mt-6"
            style={{ borderColor: 'var(--border)' }}
          >
            <blockquote className="text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              "Education is the most powerful weapon which you can use to change the world."
            </blockquote>
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              — Nelson Mandela
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <Image
              src="/assets/logo.png"
              alt="HU"
              width={40} height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-bold text-sm">Hazara University</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Smart Appointment System</div>
            </div>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
