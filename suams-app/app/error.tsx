'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-8 max-w-md text-center border border-white/5 shadow-2xl flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
          <AlertCircle size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-white mb-2">Something Went Wrong</h1>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            We encountered a network or server synchronization error while loading the portal desk.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400"
        >
          <RefreshCw size={14} className="animate-spin" /> Retry Connection
        </button>
      </motion.div>
    </div>
  );
}
