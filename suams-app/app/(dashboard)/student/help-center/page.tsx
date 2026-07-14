'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle, BookOpen, MessageSquare, AlertTriangle, Send,
  ChevronDown, Phone, Mail, Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState<'FAQ' | 'Guides' | 'Support' | 'Report'>('FAQ');
  const [faqs, setFaqs] = useState([
    { q: 'How long does approval usually take?', a: 'Standard academic requests are approved within 24 to 48 hours by the respective secretary desk.', open: false },
    { q: 'Can I cancel or reschedule my appointment?', a: 'Yes. Navigate to "My Appointments" panel on your dashboard to trigger cancellations or reschedule suggestions.', open: false },
    { q: 'What is the digital QR code slip used for?', a: 'The QR Code is verified at the secretariat entrance block for security validation before you meet the official.', open: false },
  ]);

  const [feedback, setFeedback] = useState('');
  const [issue, setIssue] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const toggleFaq = (idx: number) => {
    setFaqs(faqs.map((f, i) => i === idx ? { ...f, open: !f.open } : f));
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Issue reported to HU IT Desk! Ticket ID: HU-TKT-' + Math.floor(Math.random() * 10000));
    setIssue('');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            HU SUAMS Help & Support Desk
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Read guides, answers to FAQs, or submit tickets to the IT department.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-black/35 border border-white/5 text-xs text-zinc-400">
          {(['FAQ', 'Guides', 'Support', 'Report'] as const).map((tab) => (
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

      {msg && (
        <div className="p-3.5 rounded-xl mb-6 border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-300">
          {msg}
        </div>
      )}

      {/* Dynamic Tabs Body */}
      <AnimatePresence mode="wait">
        {activeTab === 'FAQ' && (
          <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3 max-w-3xl mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <HelpCircle size={15} /> Frequently Asked Questions
            </h3>
            {faqs.map((f, idx) => (
              <div key={idx} className="rounded-xl border border-white/5 bg-black/20 overflow-hidden text-xs">
                <button onClick={() => toggleFaq(idx)} className="w-full p-4 text-left font-bold text-white flex justify-between items-center">
                  <span>{f.q}</span>
                  <ChevronDown size={14} className={cn('transition-transform duration-200', f.open && 'rotate-180')} />
                </button>
                {f.open && (
                  <div className="p-4 pt-0 text-zinc-400 leading-relaxed border-t border-white/5 bg-black/10">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Guides' && (
          <motion.div key="guides" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4 max-w-3xl mx-auto text-xs text-zinc-300">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <BookOpen size={15} /> Student & Visitor Booking Guide
            </h3>

            <div className="p-5 rounded-2xl border border-white/5 bg-black/25 flex flex-col gap-4">
              <div>
                <span className="font-bold text-white text-sm block mb-1">1. Set Up Profile Credentials</span>
                <p className="leading-relaxed">Complete your registry with valid email, CNIC, and student program choices to verify your identity.</p>
              </div>
              <div className="border-t border-white/5 pt-4">
                <span className="font-bold text-white text-sm block mb-1">2. Choose Secretariat Official</span>
                <p className="leading-relaxed">Browse officials lists based on faculty departments or ask the global chatbot to recommend the correct office.</p>
              </div>
              <div className="border-t border-white/5 pt-4">
                <span className="font-bold text-white text-sm block mb-1">3. Generate Verification Slip</span>
                <p className="leading-relaxed">Once booked, download or print your PDF Slip. Present the QR code to security desk for entry verification.</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Support' && (
          <motion.div key="support" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4 max-w-xl mx-auto text-xs text-zinc-300 text-center py-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">Support Contact Info</h3>
            <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400"><Building size={16} /></div>
                <div>
                  <span className="font-bold text-white">HU IT Directorate Desk</span>
                  <span className="text-[10px] text-zinc-500 block">Main Secretariat Block, HU Campus</span>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400"><Mail size={16} /></div>
                <div>
                  <span className="font-bold text-white">support@hu.edu.pk</span>
                  <span className="text-[10px] text-zinc-500 block">General email helpline responses</span>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400"><Phone size={16} /></div>
                <div>
                  <span className="font-bold text-white">+92 997 123456 (Ext: 104)</span>
                  <span className="text-[10px] text-zinc-500 block">Direct campus call helpline hours (09:00 - 16:00)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Report' && (
          <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-xl mx-auto">
            <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Submit IT Support Ticket
              </h3>
              <form onSubmit={handleReport} className="flex flex-col gap-3.5 text-xs text-white">
                <div>
                  <label className="block font-semibold uppercase mb-1.5 text-zinc-400">Describe the issue *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter details of errors or bugs experienced..."
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-white/5 bg-black/25 text-white resize-none"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 flex items-center justify-center gap-1">
                  <Send size={12} /> Submit Support Request
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
