'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Send, Sparkles, HelpCircle, Calendar,
  ArrowRight, CheckCircle2, User, Building, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  options?: string[];
  recommendation?: {
    official: string;
    department: string;
    priority: 'Normal' | 'Important' | 'Urgent' | 'Emergency';
    bestDate: string;
    timeSlot: string;
    summary: string;
  };
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Greetings from Hazara University AI Secretary Desk! How can I assist you with your booking or query today?',
        options: [
          'I need admission help',
          'I want to meet the VC',
          'Transcript information query',
          'Explain appointment steps'
        ]
      }
    ]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: 'msg-' + Math.random(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate AI response with NLP smart matching keywords
    setTimeout(() => {
      let aiText = "I\'m analyzing your query using our natural language router...";
      let options: string[] = [];
      let recommendation: any = null;

      const q = textToSend.toLowerCase();

      if (q.includes('vc') || q.includes('vice chancellor')) {
        aiText = 'I detected a request to schedule a meeting with the Vice Chancellor\'s secretariat.';
        recommendation = {
          official: 'Prof. Dr. Mohsin Khan (Vice Chancellor)',
          department: 'VC Secretariat Block',
          priority: q.includes('urgent') || q.includes('emergency') ? 'Urgent' : 'Important',
          bestDate: '2026-07-14 (Today)',
          timeSlot: '11:00 AM - 11:20 AM',
          summary: 'Meeting to submit official files and seek VC executive endorsement.'
        };
      } else if (q.includes('admission') || q.includes('apply')) {
        aiText = 'For undergraduate and graduate admission queries, the Admission Office is the recommended desk.';
        recommendation = {
          official: 'Director Admissions Desk',
          department: 'Admission Office, Main Secretariat',
          priority: 'Normal',
          bestDate: '2026-07-15 (Tomorrow)',
          timeSlot: '10:00 AM - 10:20 AM',
          summary: 'Inquiry regarding BS Artificial Intelligence fee structures and deadlines.'
        };
      } else if (q.includes('transcript') || q.includes('degree') || q.includes('exam')) {
        aiText = 'I routed your query to the Controller of Examinations. Verification requests require CNIC copy files.';
        recommendation = {
          official: 'Controller of Examinations Desk',
          department: 'Examination block',
          priority: q.includes('urgent') ? 'Urgent' : 'Normal',
          bestDate: '2026-07-16',
          timeSlot: '09:00 AM - 09:20 AM',
          summary: 'Urgent degree verification signature and NOC requirements for abroad migration.'
        };
      } else if (q.includes('step') || q.includes('book') || q.includes('how to')) {
        aiText = 'To book an appointment:\n1. Select your role (e.g. Student).\n2. Select your target Faculty and Department.\n3. Choose your official & select an available timeslot.\n4. Write down details and print your Slip!';
        options = ['Book Appointment Now', 'View My Dashboard'];
      } else {
        aiText = 'I could not match a specific department automatically. Try asking: "I want to meet the VC" or "I need admission help".';
        options = ['I need admission help', 'I want to meet the VC'];
      }

      const aiMsg: Message = {
        id: 'ai-' + Math.random(),
        sender: 'ai',
        text: aiText,
        options,
        recommendation
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Bot Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl overflow-hidden mb-4 border flex flex-col relative"
            style={{
              background: 'rgba(10, 10, 10, 0.85)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold text-xs shadow-lg shadow-amber-500/10">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white uppercase tracking-wider">AI Assistant</h4>
                  <span className="text-[9px] text-green-400 flex items-center gap-1 font-mono">🟢 Desk Online</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((m) => (
                <div key={m.id} className={cn('flex flex-col max-w-[85%]', m.sender === 'user' ? 'self-end items-end' : 'self-start items-start')}>
                  <div
                    className={cn(
                      'p-3.5 rounded-2xl text-xs leading-relaxed',
                      m.sender === 'user'
                        ? 'bg-amber-500 text-black font-semibold rounded-tr-none'
                        : 'bg-white/5 border border-white/5 text-zinc-200 rounded-tl-none'
                    )}
                  >
                    {m.text}
                  </div>

                  {/* Recommendation Card */}
                  {m.recommendation && (
                    <div className="mt-3 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-white flex flex-col gap-2.5 w-full">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                        <Sparkles size={12} /> AI Recommendation Routing
                      </div>
                      <div className="flex flex-col gap-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Official</span>
                          <span className="font-semibold text-white">{m.recommendation.official}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Office Block</span>
                          <span className="font-semibold text-white">{m.recommendation.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Detected Priority</span>
                          <span className="font-bold text-amber-400">{m.recommendation.priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Slot Suggestion</span>
                          <span className="font-semibold text-emerald-400">{m.recommendation.bestDate} at {m.recommendation.timeSlot}</span>
                        </div>
                      </div>
                      <div className="border-t border-white/5 pt-2 mt-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">Meeting Summary Preview</span>
                        <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">{m.recommendation.summary}</p>
                      </div>
                      <button
                        onClick={() => handleSend('Book recommendation appointment')}
                        className="w-full mt-1.5 py-2 rounded-lg bg-amber-500 text-black font-bold text-center flex items-center justify-center gap-1 hover:bg-amber-400 text-[10px]"
                      >
                        Apply this routing <ArrowRight size={10} />
                      </button>
                    </div>
                  )}

                  {/* Options */}
                  {m.options && m.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {m.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSend(opt)}
                          className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-[10px] text-amber-400 hover:bg-white/10 font-medium"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-white/5 bg-black/30 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'I want to meet the VC'..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/5 bg-black/25 text-xs text-white outline-none focus:border-amber-400"
              />
              <button
                onClick={() => handleSend(input)}
                className="p-2.5 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center justify-center shadow-lg shadow-amber-500/20 group relative"
      >
        <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full border-2 border-zinc-900 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">1</span>
      </button>
    </div>
  );
}
