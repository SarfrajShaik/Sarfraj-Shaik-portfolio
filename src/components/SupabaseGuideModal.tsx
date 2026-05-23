import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, CheckCircle, AlertTriangle, Terminal, Key, Cpu, Copy, Check } from 'lucide-react';
import { isSupabaseConfigured } from '../supabaseClient';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export default function SupabaseGuideModal({ isOpen, onClose, theme }: SupabaseGuideModalProps) {
  const isDark = theme === 'dark';
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';

  const sqlSchema = `-- 1. CREATE SERVICES TABLE
create table services (
  id text primary key,
  title text not null,
  description text not null,
  iconName text not null
);

-- Seed Services
insert into services (id, title, description, iconName) values
('ideation', 'Ideation and Prototyping', 'Idea generation and prototyping are two of the most important aspects of product development.', 'Workflow'),
('headless', 'Headless Web Development', 'Headless architecture can improve performance since the frontend is optimized to render content efficiently.', 'Globe'),
('redesign', 'Redesigning Products', 'Sometimes you don\\'t need to start everything from scratch. Redesigning existing apps can be cost effective.', 'Wrench'),
('coach', 'Coach teams', 'I can coach teams of small and medium size. Topics I can coach on are frontend development and UI design.', 'Users'),
('building', 'Team Building', 'Team building is crucial for any enterprise, regardless of the size. I can help building a team of suitable professionals.', 'HeartHandshake');

-- 2. CREATE POSTS TABLE
create table posts (
  id text primary key,
  title text not null,
  excerpt text not null,
  date text not null,
  readTime text not null,
  category text not null
);

-- Seed Posts
insert into posts (id, title, excerpt, date, readTime, category) values
('post-1', 'Design Systems: Streamlining Collaboration Between Developers and Designers', 'A well-structured design system is a game-changer for teams working on frontend development and UI design. This article explores how design systems enhance collaboration, promote consistency, and expedite the design-to-development process.', 'Jul 10', '5 min read', 'Design'),
('post-2', 'The Role of Animation in Modern User Interfaces: Enhancing Interactivity and Engagement', 'Animations can breathe life into static interfaces when used with intent. Discover how motion design coordinates attention, reduces cognitive load, and builds an intuitive flow for interactive products.', 'Jul 04', '5 min read', 'Design'),
('post-3', 'Optimizing Web Performance: Strategies for Faster Load Times and Smoother User Experiences', 'Performance is crucial in modern web development. This article covers techniques and best practices to optimize frontend code, leverage caching, and improve website performance, resulting in quicker load times and a better user experience.', 'Jun 28', '6 min read', 'Optimization'),
('post-4', 'Modular Frontend Architectures: Organizing Large React Workspaces for Scale', 'Scaling software requires structuring code logically before issues arise. Explore modular designs, package scopes, and folder structures that foster rapid expansion without codebase friction.', 'May 16', '8 min read', 'Development');

-- 3. CREATE CONTACTS TABLE
create table contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CREATE NEWSLETTER_SUBSCRIPTIONS TABLE
create table newsletter_subscriptions (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null
);`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="supabase-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: 'spring', duration: 0.5 }}
            id="supabase-modal-body"
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border ${
              isDark 
                ? 'bg-solo-bg-dark border-solo-border-dark text-white' 
                : 'bg-white border-neutral-200 text-neutral-900'
            } p-5 sm:p-6 md:p-8 shadow-2xl z-10 scrollbar-none`}
          >
            {/* Close Button */}
            <button
              id="close-supabase-btn"
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-solo-card-dark text-solo-accent hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <X size={18} />
            </button>
 
            {/* Header Content */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl ${isDark ? 'bg-solo-card-dark text-solo-accent' : 'bg-white border border-neutral-300 text-neutral-800'}`}>
                <Database size={24} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">Supabase Connectivity Workspace</h3>
                <p className={`text-xs ${isDark ? 'text-solo-accent' : 'text-neutral-500'}`}>
                  Manage backend database tables, seed sample payloads, and verify pipeline health.
                </p>
              </div>
            </div>
 
            {/* Connection Status Panel */}
            <div className={`p-4 rounded-xl mb-6 border ${
              isSupabaseConfigured 
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
            }`}>
              <div className="flex items-start gap-3">
                {isSupabaseConfigured ? (
                  <CheckCircle size={20} className="text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle size={20} className="text-amber-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Connection State: {isSupabaseConfigured ? 'Ready & Linked' : 'Sandbox Simulated'}
                  </h4>
                  <p className={`text-[11px] mt-1 leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {isSupabaseConfigured 
                      ? `Successfully connected to dynamic endpoint: ${supabaseUrl}. All contacts and blog reads execute instantly via Supabase!`
                      : 'The workspace is active in Sandbox local mode because credentials are not set. You can fully use, subscribe and mock submissions immediately!'}
                  </p>
                </div>
              </div>
            </div>
 
            {/* Setup Guides Step-by-Step */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-shadow dark:text-solo-accent mb-2.5 flex items-center gap-1.5 font-mono">
                  <Key size={12} /> Step 1: Add Credentials in settings
                </h4>
                <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  Configure the following two environment keys inside the **Secrets panel** (Settings logo in the top right menu) of AI Studio:
                </p>
                <div className={`p-3 rounded-lg font-mono text-[10px] space-y-1 bg-black/30 border border-solo-border-dark`}>
                  <div className="flex justify-between">
                    <span className="text-solo-accent font-semibold">VITE_SUPABASE_URL</span>
                    <span className="text-neutral-500">Your Supabase API URL endpoint</span>
                  </div>
                  <div className="flex justify-between border-t border-solo-card-dark pt-1 mt-1">
                    <span className="text-solo-accent font-semibold">VITE_SUPABASE_ANON_KEY</span>
                    <span className="text-neutral-500">Your public anon client token</span>
                  </div>
                </div>
              </div>
 
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-shadow dark:text-solo-accent mb-2.5 flex items-center gap-1.5 font-mono">
                  <Terminal size={12} /> Step 2: Provision Database Tables
                </h4>
                <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  To map this client application automatically to your database, simply open your **Supabase SQL Editor** and paste the query below to construct and seed all state tables instantly:
                </p>
                
                <div className="relative">
                  <pre className="font-mono text-[9px] overflow-x-auto p-4 rounded-lg bg-black/45 border border-solo-border-dark max-h-48 text-solo-accent scrollbar-thin">
                    {sqlSchema}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(sqlSchema, 'schema')}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-solo-card-dark text-solo-accent hover:text-white transition-colors border border-solo-border-dark"
                    title="Copy full SQL queries script"
                  >
                    {copiedSection === 'schema' ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
 
              <div className="border-t border-solo-border-dark pt-4 mt-4 text-center">
                <p className="text-[10px] font-mono text-neutral-400">
                  <Cpu className="inline-block mr-1" size={10} /> Powered by Next.js SPA, Supabase Database Server & Tailwind CSS.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
