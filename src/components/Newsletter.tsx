import React, { useState } from 'react';
import { Mail, CheckCircle, Terminal, Cpu, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { submitNewsletterSubscription } from '../supabaseClient';

interface NewsletterProps {
  theme: 'dark' | 'light';
}

export default function Newsletter({ theme }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter an email.');
      setStatus('error');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please check your email formatting.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await submitNewsletterSubscription(email);
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error subscribing to database.');
      setStatus('error');
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      id="newsletter-card"
      className={`rounded-2xl border transition-all duration-300 p-8 shadow-sm flex flex-col justify-between min-h-[310px] ${
        isDark
          ? 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700/80 hover:shadow-md'
          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
      }`}
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-state"
            initial={{ opacity: 0, scale: 0.98, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="flex flex-col items-center justify-center py-6 text-center h-full my-auto"
          >
            <div className={`p-3 rounded-full mb-3.5 ${
              isDark 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
            }`}>
              <CheckCircle size={24} />
            </div>
            <h4 className="font-display font-bold text-lg leading-snug">Awesome, you're subscribed!</h4>
            <p className={`text-xs mt-2 leading-relaxed max-w-[240px] ${
              isDark ? 'text-neutral-400' : 'text-neutral-550'
            }`}>
              Check your inbox shortly to confirm your subscription. Talk soon!
            </p>
            <button
              id="newsletter-reset-btn"
              onClick={() => setStatus('idle')}
              className={`text-xs mt-5 underline hover:cursor-pointer transition-colors ${
                isDark 
                  ? 'text-neutral-400 hover:text-white' 
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              Subscribe another email
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="signup-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-between h-full w-full"
          >
            <div>
              <div className="flex items-center gap-2 mb-4 text-xs">
                <Mail size={14} className={isDark ? 'text-sky-400/90' : 'text-sky-600/90'} />
                <span className={`font-mono text-[10px] tracking-widest uppercase font-semibold ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  NEWSLETTER
                </span>
              </div>

              <h4 className="font-display text-lg font-bold tracking-tight mb-2">
                Subscribe to my newsletter
              </h4>
              
              <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Get important insights, design inspiration, software tips, and engineering articles delivered straight to your inbox.
              </p>

              {/* Minimalist Specs aligned with technical writing topics */}
              <div className="flex flex-wrap gap-2.5 mt-5">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wide border transition-colors ${
                  isDark 
                    ? 'bg-neutral-950/40 text-neutral-400 border-neutral-800/60 group-hover:border-neutral-850' 
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200/60 group-hover:border-neutral-300/80'
                }`}>
                  <Terminal size={10} className={isDark ? 'text-teal-400/90' : 'text-teal-600/90'} />
                  <span>Tech Logs</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wide border transition-colors ${
                  isDark 
                    ? 'bg-neutral-950/40 text-neutral-400 border-neutral-800/60 group-hover:border-neutral-850' 
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200/60 group-hover:border-neutral-300/80'
                }`}>
                  <BookOpen size={10} className={isDark ? 'text-sky-400/90' : 'text-sky-600/90'} />
                  <span>Algorithms</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wide border transition-colors ${
                  isDark 
                    ? 'bg-neutral-950/40 text-neutral-400 border-neutral-800/60 group-hover:border-neutral-850' 
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200/60 group-hover:border-neutral-300/80'
                }`}>
                  <Cpu size={10} className={isDark ? 'text-indigo-400/90' : 'text-indigo-600/90'} />
                  <span>Modern Stack</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubscribe} className="relative flex items-center mb-2 group/form">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  disabled={status === 'loading'}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Email address"
                  className={`w-full text-xs px-4 py-3.5 pr-28 rounded-xl border focus:outline-none transition-all duration-300 ease-out ${
                    isDark
                      ? 'bg-neutral-950/40 border-neutral-800 text-white focus:border-neutral-700 focus:bg-neutral-950 shadow-inner placeholder-neutral-500'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-neutral-300 focus:bg-white shadow-inner placeholder-neutral-400'
                  }`}
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  disabled={status === 'loading'}
                  className={`absolute right-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ease-out active:scale-95 select-none hover:cursor-pointer flex items-center gap-1 ${
                    isDark
                      ? 'bg-white text-neutral-950 hover:bg-neutral-100 disabled:bg-neutral-850 disabled:text-neutral-700'
                      : 'bg-neutral-950 text-white hover:bg-neutral-900 disabled:bg-neutral-200'
                  }`}
                >
                  <span>{status === 'loading' ? 'Sending...' : 'Subscribe'}</span>
                  <ArrowRight size={11} className="opacity-90 transition-transform duration-200 group-hover/form:translate-x-0.5" />
                </button>
              </form>

              <AnimatePresence>
                {status === 'error' && (
                  <motion.p 
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    className="text-red-500 dark:text-rose-400 text-[11px] mb-2 font-medium"
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <p className={`text-[10px] leading-relaxed font-mono tracking-tight mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Zero clutter. Read my{' '}
                <span className="underline cursor-pointer hover:text-sky-500 transition-colors">privacy policy</span>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
