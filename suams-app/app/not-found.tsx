'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-8 max-w-md text-center border border-white/5 shadow-2xl flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 text-3xl">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-white mb-2">404 - Desk Not Found</h1>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            The administrative desk or route you are searching for is unavailable at Hazara University SUAMS.
          </p>
        </div>
        <Link href="/" className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400">
          <ArrowLeft size={14} /> Back to Campus Landing
        </Link>
      </motion.div>
    </div>
  );
}
