import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { Post } from '../types';

interface BlogPostModalProps {
  post: Post | null;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export default function BlogPostModal({ post, onClose, theme }: BlogPostModalProps) {
  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {post && (
        <div id="blog-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            id="blog-modal-body"
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border ${
              isDark 
                ? 'bg-solo-card-dark border-solo-border-dark text-white' 
                : 'bg-solo-card-light border-solo-border-light text-neutral-900'
            } p-5 sm:p-6 md:p-8 shadow-2xl z-10 scrollbar-thin`}
          >
            {/* Close */}
            <button
              id="close-blog-btn"
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <X size={18} />
            </button>

            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-400 mb-4 mt-2">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {post.date}, 2023
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1 bg-neutral-900 text-neutral-400 dark:bg-neutral-950 dark:text-[#a3a3a3] px-2 py-0.5 rounded">
                <Tag size={10} />
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6 leading-tight">
              {post.title}
            </h3>

            {/* Body contents */}
            <div className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              <p className="font-medium text-base">
                Discovering the delicate balance between functional code, rigorous performance standards, and aesthetic layout patterns is the modern UX frontier.
              </p>
              <p>
                A web-scale design system is much more than a collection of buttons and color codes published in Figma. It represents a living contract between designers and engineers. By creating shared token guidelines (spacing systems, semantic coloring tables, type curves), cross-functional guilds can skip low-yield implementation iterations and deploy complex features at speed.
              </p>
              <p>
                In modular component construction, we focus heavily on state decoupling and composability. When building for headless architectures, taking care of the dynamic state loops inside custom hooks (like `useIntersectionObserver` or `useMutation`) guarantees that the DOM tree updates with high efficiency, preventing costly tree reflows.
              </p>
              <p className="border-l-2 border-neutral-700 pl-4 py-1 italic text-neutral-400">
                "Simple is not easy. Simplicity requires understanding the true boundaries of the task and designing precisely to that perimeter."
              </p>
              <p>
                As Sarfraj notes, when we build with lightweight libraries like Tailwind CSS alongside smooth, spring-based motion controllers, we can forge user-facing interactions that look organic and feel highly intuitive. In our next column, we will delve deeper into optimizing lazy loading parameters inside hydration trees!
              </p>
            </div>

            {/* Footer Sign-off */}
            <div className="border-t border-neutral-850 mt-8 pt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
                  alt="Sarfraj"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold font-mono">Written by SARFRAJ</p>
                <p className="text-[10px] text-neutral-400 font-mono">Creative Technologist, Sarfraj Labs</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
