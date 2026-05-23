import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Check, Terminal, Database, Code, Sparkles, MessageSquare } from 'lucide-react';
import { submitContactMessage } from '../supabaseClient';

interface GetInTouchModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export default function GetInTouchModal({ isOpen, onClose, theme }: GetInTouchModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const topics = [
    { id: 'ds', label: 'Data Science Project', icon: Database, bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
    { id: 'se', label: 'Engineering Role / Internship', icon: Code, bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'academic', label: 'Research & Algorithms', icon: Terminal, bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { id: 'other', label: 'General Project / Say Hi!', icon: Sparkles, bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  ];

  const handleTopicSelect = (topicLabel: string) => {
    setSelectedTopic(topicLabel);
    
    // Cool dynamic autofill for the beginning of the message based on selection
    let prefix = '';
    if (topicLabel.includes('Engineering')) {
      prefix = `Hello Sarfraj, I visited your academic portfolio and would love to discuss a prospective software engineering role or internship opportunity at... `;
    } else if (topicLabel.includes('Data Science')) {
      prefix = `Hi Sarfraj, I am interested in collaborating or consulting on a data science project related to... `;
    } else if (topicLabel.includes('Research')) {
      prefix = `Hey Sarfraj, let's exchange some ideas regarding advanced algorithms or systems engineering... `;
    } else {
      prefix = `Hi Sarfraj, I wanted to say hello after reviewing your portfolio... `;
    }
    setFormData(prev => ({ ...prev, message: prefix }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email.';
    }
    if (!formData.message.trim()) newErrors.message = 'Please provide a short message.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Append selected topic to the message metadata for full tracking
      const finalMessage = selectedTopic 
        ? `[Topic: ${selectedTopic}]\n\n${formData.message}`
        : formData.message;

      // 1. Send securely to the server api route (which sends via Nodemailer)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: finalMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server failed to dispatch the message.');
      }

      // 2. Also keep Supabase storage if connected
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        message: finalMessage
      });
      
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setSelectedTopic('');
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'An error occurred while submitting message.');
    }
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="contact-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            id="contact-modal-body"
            className={`relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-xl border ${
              isDark 
                ? 'bg-neutral-950 border-neutral-900 text-white' 
                : 'bg-white border-neutral-200 text-neutral-900'
            } p-5 sm:p-6 md:p-8 shadow-2xl z-10 scrollbar-thin`}
          >
            {/* Close Button */}
            <button
              id="close-modal-btn"
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-neutral-900 text-neutral-500 hover:text-white' : 'hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <X size={16} />
            </button>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className={`p-4 rounded-full ${isDark ? 'bg-emerald-950/40 border border-emerald-500/25 text-emerald-400' : 'bg-emerald-50 border border-emerald-500/20 text-emerald-600'} mb-4`}>
                  <Check size={32} />
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight mb-2">Message Dispatched</h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'} max-w-xs leading-relaxed`}>
                  Thanks! Your message has been securely sent directly to Sarfraj's inbox and preserved back-end. He will review this and respond back.
                </p>
              </motion.div>
            ) : (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-500 font-bold">
                      Sarfraj Inquiries Engine
                    </span>
                  </div>
                  <h3 id="modal-title" className="font-display text-lg sm:text-xl font-bold tracking-tight">
                    Let's Build & Collaborate
                  </h3>
                  <p id="modal-subtitle" className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Active final year CS Student & aspiring Data Scientist. Drop your opportunity, ideas, research collaborations, or a simple message!
                  </p>
                </div>

                {/* Cool Dynamic Topic Selectors */}
                <div className="mb-5">
                  <span className={`block text-[10px] font-mono uppercase tracking-wider mb-2 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    Select Quick Topic Setup (Optional)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {topics.map((t) => {
                      const Icon = t.icon;
                      const isSelected = selectedTopic === t.label;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleTopicSelect(t.label)}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 select-none ${
                            isSelected
                              ? isDark 
                                ? 'bg-sky-500/10 border-sky-400 text-sky-400 scale-[1.01]'
                                : 'bg-sky-50 border-sky-500 text-sky-700 scale-[1.01] font-medium'
                              : isDark
                                ? 'bg-neutral-900/40 border-neutral-900/80 text-neutral-400 hover:bg-neutral-900 hover:text-white'
                                : 'bg-neutral-50 border-neutral-200/80 text-neutral-600 hover:bg-neutral-100/50 hover:text-neutral-900'
                          }`}
                        >
                          <Icon size={13} className="flex-shrink-0" />
                          <span className="text-[10.5px] font-mono leading-none">{t.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form Input Fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-[10.5px] font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none transition-colors ${
                        isDark 
                          ? 'bg-neutral-900/40 border-neutral-850 text-white focus:border-sky-500/50 focus:bg-neutral-900' 
                          : 'bg-white border-neutral-200 text-neutral-900 focus:border-sky-500/50 focus:bg-neutral-50'
                      }`}
                      placeholder=""
                    />
                    {errors.name && <p className="text-rose-500 text-[10px] font-mono mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className={`block text-[10.5px] font-mono uppercase tracking-wider mb-1.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Email address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none transition-colors ${
                        isDark 
                          ? 'bg-neutral-900/40 border-neutral-850 text-white focus:border-sky-500/50 focus:bg-neutral-900' 
                          : 'bg-white border-neutral-200 text-neutral-900 focus:border-sky-500/50 focus:bg-neutral-50'
                      }`}
                      placeholder=""
                    />
                    {errors.email && <p className="text-rose-500 text-[10px] font-mono mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`block text-[10.5px] font-mono uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Your Message
                      </label>
                      {selectedTopic && (
                        <span className="text-[9px] font-mono text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded">
                          Preset Configured
                        </span>
                      )}
                    </div>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none transition-colors resize-none ${
                        isDark 
                          ? 'bg-neutral-900/40 border-neutral-850 text-white focus:border-sky-500/50 focus:bg-neutral-900' 
                          : 'bg-white border-neutral-200 text-neutral-900 focus:border-sky-500/50 focus:bg-neutral-50'
                      }`}
                      placeholder=""
                    />
                    {errors.message && <p className="text-rose-500 text-[10px] font-mono mt-1">{errors.message}</p>}
                  </div>

                  {submitError && (
                    <p className="text-rose-500 text-[10px] font-mono text-center bg-rose-500/10 border border-rose-500/20 rounded-lg p-2">
                      {submitError}
                    </p>
                  )}

                  <button
                    id="submit-contact"
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-2 font-mono text-[11px] uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-150 active:scale-98 hover:cursor-pointer ${
                      isDark 
                        ? 'bg-white text-neutral-950 hover:bg-neutral-200 disabled:bg-neutral-700' 
                        : 'bg-neutral-950 text-white hover:bg-neutral-900 disabled:bg-neutral-300'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Writing Stream...</span>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send size={12} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

