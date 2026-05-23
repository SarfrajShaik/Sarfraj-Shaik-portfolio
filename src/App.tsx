/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Workflow,
  Globe,
  Wrench,
  Users,
  HeartHandshake,
  MessageSquare,
  Lightbulb,
  Plus,
  ArrowUpRight,
  BookOpen,
  Compass,
  FileCode,
  Sparkles,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Cpu,
  Terminal,
  Send,
  ArrowUp
} from 'lucide-react';

import { Post, Service } from './types';
import { servicesData, postsData, projectsData } from './data';
import { getSupabaseServices, getSupabasePosts, isSupabaseConfigured } from './supabaseClient';

import Header from './components/Header';
import GetInTouchModal from './components/GetInTouchModal';
import BlogPostModal from './components/BlogPostModal';
import SupabaseGuideModal from './components/SupabaseGuideModal';
import MovingBackground from './components/MovingBackground';
import AestheticVisualizer from './components/AestheticVisualizer';
// @ts-expect-error - Vite handles jpg loading, but TypeScript requires a module declaration
import profileAvatar from './assets/images/regenerated_image_1779327804544.jpg';

export default function App() {
  const theme = 'dark';
  const [activeSection, setActiveSection] = useState<string>('about');

  // Interactive panels states
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Supabase states
  const [posts, setPosts] = useState<Post[]>(postsData);
  const [services, setServices] = useState<Service[]>(servicesData);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Back to top state
  const [showBackToTop, setShowBackToTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('about-section');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // Show after scrolling past the about/hero section
        setShowBackToTop(rect.bottom <= 0);
      } else {
        setShowBackToTop(window.scrollY > 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    async function loadData() {
      if (isSupabaseConfigured) {
        const servicesResult = await getSupabaseServices(servicesData);
        if (servicesResult.data) {
          setServices(servicesResult.data);
        }
        
        const postsResult = await getSupabasePosts(postsData);
        if (postsResult.data) {
          setPosts(postsResult.data);
        }
        if (servicesResult.error || postsResult.error) {
          setDbError(servicesResult.error || postsResult.error);
        }
      }
    }
    loadData();
  }, []);

  // Category filter state for blog posts
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(3);

  const isDark = theme === 'dark';

  // Helper mapping string icon name to Lucide components
  const getServiceIcon = (name: string) => {
    const iconClass = "text-neutral-800 dark:text-solo-accent group-hover:text-neutral-500 dark:group-hover:text-neutral-200 transition-colors";
    switch (name) {
      case 'Workflow':
        return <Workflow size={28} className={iconClass} />;
      case 'Globe':
        return <Globe size={28} className={iconClass} />;
      case 'Wrench':
        return <Wrench size={28} className={iconClass} />;
      case 'Users':
        return <Users size={28} className={iconClass} />;
      case 'HeartHandshake':
        return <HeartHandshake size={28} className={iconClass} />;
      case 'Sparkles':
        return <Sparkles size={28} className={iconClass} />;
      case 'Compass':
        return <Compass size={28} className={iconClass} />;
      default:
        return <Plus size={28} className="text-neutral-400" />;
    }
  };

  // Filter posts based on choice
  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === 'All') return true;
    return post.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categories = ['All', 'Design', 'Optimization', 'Development'];

  const smoothScrollTo = (targetY: number, duration: number = 300) => {
    const startY = window.pageYOffset || window.scrollY;
    const difference = targetY - startY;
    if (Math.abs(difference) < 2) return;
    const startTime = performance.now();

    const cubicEasing = (t: number) => {
      return 1 - Math.pow(1 - t, 3);
    };

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = cubicEasing(progress);

      window.scrollTo(0, startY + difference * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const handleNavClick = (section: 'about' | 'projects' | 'resume') => {
    setActiveSection(section);
    // Accommodate sticky header height (~76-96px) with breathing room
    const headerOffset = window.innerWidth >= 768 ? 108 : 88;
    
    if (section === 'about') {
      smoothScrollTo(0, 320);
    } else if (section === 'projects') {
      const el = document.getElementById('projects-section');
      if (el) {
        const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        smoothScrollTo(targetY, 380);
      }
    } else if (section === 'resume') {
      const el = document.getElementById('resume-section');
      if (el) {
        const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        smoothScrollTo(targetY, 380);
      }
    }
  };

  return (
    <div
      id="app-theme-root"
      className={`min-h-screen transition-colors duration-500 overflow-x-hidden relative ${
        isDark
          ? 'bg-solo-bg-dark text-white bg-dots-dark'
          : 'bg-solo-bg-light text-neutral-900 bg-dots-light'
      }`}
    >
      {/* Animated fluid and interactive background layer */}
      <MovingBackground theme={theme} />

      {/* Container wrapper */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 md:px-10 pb-16 flex flex-col min-h-screen relative z-10">
        {/* Navigation Header */}
        <Header
          theme={theme}
          activeSection={activeSection}
          onNavClick={handleNavClick}
          onContactClick={() => setIsContactOpen(true)}
        />

        {/* Main Content Sections */}
        <main className="flex-grow mt-24 md:mt-28">
          {/* Section 1: Hero Profile Row */}
          <div id="about-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center mb-16 md:mb-24 scroll-mt-28 md:scroll-mt-32">
            {/* Left Portion: Avatar, Greeting, Description, CTA */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Profile Avatar with elegant responsive high-tech visual frame */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 cursor-pointer flex items-center justify-center group select-none">
                {/* 1. Deep Futuristic Ambient Glass Glow */}
                <div className={`absolute -inset-5 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500 bg-gradient-to-tr ${
                  isDark ? 'from-sky-500/20 to-teal-500/25' : 'from-sky-300/30 to-blue-400/25'
                }`} />

                {/* 2. Concentric Outer Clockwise Dash Ring */}
                <motion.div
                  className={`absolute -inset-3.5 rounded-full border border-dashed opacity-25 group-hover:opacity-85 transition-all duration-300 ease-out ${
                    isDark ? 'border-sky-500/30' : 'border-sky-500/40'
                  }`}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
                />

                {/* 3. Concentric Inner Counter-Clockwise Dotted Ring */}
                <motion.div
                  className={`absolute -inset-2.5 rounded-full border border-dotted opacity-20 group-hover:opacity-75 transition-all duration-300 ease-out ${
                    isDark ? 'border-indigo-400/40' : 'border-indigo-500/40'
                  }`}
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
                />

                {/* 4. Robotic High-Tech Orbiting Dot Indicator */}
                <motion.div
                  className="absolute -inset-3.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                  <div className={`absolute top-0 left-1/2 -ml-1 w-2 h-2 rounded-full animate-pulse shadow-lg ${
                    isDark ? 'bg-sky-400 shadow-sky-400/50' : 'bg-sky-500 shadow-sky-500/50'
                  }`} />
                </motion.div>

                {/* 5. Dynamic Expansion Geometric Circle */}
                <div 
                  className={`absolute -inset-1 rounded-full border opacity-0 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300 ease-out pointer-events-none ${
                    isDark ? 'border-sky-500/20' : 'border-sky-400/30'
                  }`} 
                />

                {/* 6. Main Smooth Image Frame Container */}
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 22,
                    opacity: { duration: 0.6 }
                  }}
                  id="profile-avatar-frame"
                  className={`relative w-full h-full rounded-full overflow-hidden border shadow-2xl flex items-center justify-center aspect-square transition-all duration-300 ease-out ${
                    isDark 
                      ? 'bg-[#212529] border-white/10 group-hover:border-sky-500/30 shadow-black/60' 
                      : 'bg-[#F1FAEE] border-neutral-900/10 group-hover:border-sky-400/40 shadow-neutral-200/50'
                  }`}
                >
                  <img
                    src={profileAvatar}
                    alt="Sarfraj portrait"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover object-center rounded-full transition-all duration-500 ease-out group-hover:scale-105 will-change-transform filter ${
                      isDark
                        ? 'brightness-[0.93] contrast-[0.98] saturate-[0.92] group-hover:brightness-[1.02] group-hover:contrast-[1.02] group-hover:saturate-[1.05]'
                        : 'brightness-[0.97] contrast-[0.96] saturate-[0.95] group-hover:brightness-[1.02] group-hover:contrast-[1.01] group-hover:saturate-[1.05]'
                    }`}
                    style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                  />

                  {/* High-fidelity color harmonize overlay to seamlessly blend photo warmth with background temperature */}
                  <div className={`absolute inset-0 rounded-full mix-blend-color pointer-events-none transition-opacity duration-500 ${
                    isDark 
                      ? 'bg-sky-500/8 group-hover:opacity-0' 
                      : 'bg-sky-600/4 group-hover:opacity-0'
                  }`} />
                  
                  {/* Subtle Vignette & bottom shadow fade to merge organic shapes into the page */}
                  <div className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 bg-gradient-to-t ${
                    isDark
                      ? 'from-[#212529]/60 via-transparent to-transparent opacity-80 group-hover:opacity-40'
                      : 'from-[#F1FAEE]/50 via-transparent to-transparent opacity-70 group-hover:opacity-30'
                  }`} />
                  
                  {/* Hardware Accelerated Subpixel Smoothing Ring Overlay */}
                  <div className={`absolute inset-0 rounded-full ring-1 ring-inset pointer-events-none transition-colors duration-300 ${
                    isDark ? 'ring-white/5 group-hover:ring-sky-400/30' : 'ring-black/5 group-hover:ring-sky-500/20'
                  }`} />
                </motion.div>
              </div>



              {/* Display Display Header with Sleek Spotlight Gradient */}
              <motion.h1
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-3xl"
              >
                <span className={isDark ? 'text-white' : 'text-neutral-950'}>
                  Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 dark:from-sky-400 dark:via-sky-300 dark:to-teal-300 font-extrabold">Sarfraj</span>.
                </span>
              </motion.h1>

              {/* Bio description */}
              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className={`text-xs sm:text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-normal ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                As a final-year <strong className={isDark ? 'text-neutral-200 font-semibold' : 'text-neutral-800 font-semibold'}>Computer Science student</strong> and <strong className="text-sky-500 dark:text-sky-400 font-semibold">Aspiring Data Scientist</strong>, I bridge the gap between analytical statistics and high-performance software. I specialize in training{' '}
                <span
                  className={`font-semibold font-mono text-[11px] sm:text-xs rounded px-1.5 py-0.5 border ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-800 text-sky-400 font-medium'
                      : 'bg-neutral-100 border-neutral-200 text-sky-850 font-medium'
                  }`}
                >
                  predictive models
                </span>{' '}
                and orchestrating{' '}
                <span
                  className={`font-semibold font-mono text-[11px] sm:text-xs rounded px-1.5 py-0.5 border ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-800 text-teal-400 font-medium'
                      : 'bg-neutral-100 border-neutral-200 text-teal-850 font-medium'
                  }`}
                >
                  intelligent data pipelines
                </span>{' '}
                to transform raw complexities into scalable, action-ready solutions.
              </motion.p>

              {/* CTA button */}
              <motion.button
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.35,
                  type: 'spring',
                  stiffness: 400,
                  damping: 24
                }}
                whileHover={{ 
                  y: -1.5,
                  scale: 1.025,
                  boxShadow: isDark 
                    ? '0 10px 20px -10px rgba(255, 255, 255, 0.08)' 
                    : '0 10px 20px -10px rgba(0, 0, 0, 0.08)',
                }}
                whileTap={{ scale: 0.97 }}
                id="hero-contact-btn"
                onClick={() => setIsContactOpen(true)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-150 ease-out shadow-sm select-none hover:cursor-pointer group ${
                  isDark
                    ? 'bg-neutral-950 text-white border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700'
                    : 'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-400'
                }`}
              >
                <span>Get in touch</span>
                <MessageSquare size={13} className="opacity-80 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
              </motion.button>
            </div>

            {/* Right Portion: Non-interactive 3D Rubik's cube graphic element */}
            <div className="lg:col-span-5 w-full flex items-center justify-center">
              <AestheticVisualizer theme={theme} />
            </div>
          </div>

          {/* Section 2: What I Can Offer (rounded containment card) */}
          <section id="services-section" className="mb-20">
            <div
              className={`rounded-2xl border ${
                isDark ? 'bg-solo-card-dark border-solo-border-dark' : 'bg-solo-card-light border-solo-border-light'
              } p-5 sm:p-8 md:p-12 shadow-sm`}
            >
              {/* Section Header */}
              <div className="max-w-xl mb-12">
                <span className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-mono font-semibold">
                  Academic Focus & Specializations
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mt-2 pb-2">
                  Computer Science & Data Science Domain
                </h2>
                <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Bridging core software engineering fundamentals with statistical learning and empirical design. As a final-year CS student, here are the principal fields where I develop code and build analytical workflows.
                </p>
              </div>

              {/* Grid of Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                   <div
                     id={`service-${service.id}`}
                     key={service.id}
                     className={`group p-6 rounded-xl border transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-md ${
                       isDark
                         ? 'bg-neutral-950/30 border-neutral-900 hover:border-sky-500/30 hover:bg-neutral-950/50 active:scale-[0.995]'
                         : 'bg-neutral-100/20 border-neutral-200/80 hover:border-sky-400/40 hover:bg-white active:scale-[0.995]'
                     }`}
                   >
                     {/* Unique service icon wrapper */}
                     <div className="mb-5 flex items-center justify-between">
                       <div className="p-2.5 rounded-lg bg-neutral-900/10 dark:bg-neutral-900/50 transition-all duration-150 ease-out group-hover:scale-110 group-hover:bg-sky-500/5 dark:group-hover:bg-sky-500/10">
                         {getServiceIcon(service.iconName)}
                       </div>
                       <span className="text-[10px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out">
                         0{index + 1}
                       </span>
                     </div>

                    <h3 className="font-display text-sm font-bold tracking-tight mb-2">
                      {service.title}
                    </h3>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2.5: Featured Sandbox Projects (Inline) */}
          <section id="projects-section" className="mb-20">
            <div
              className={`rounded-xl border ${
                isDark ? 'bg-neutral-950/20 border-neutral-900' : 'bg-neutral-50/20 border-neutral-200'
              } p-5 sm:p-6 md:p-8 shadow-sm`}
            >
              {/* Projects Header */}
              <div className="max-w-xl mb-10">
                <span className="text-[10px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-mono font-semibold">
                  Data Science Portfolio
                </span>
                <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight mt-1 text-neutral-950 dark:text-neutral-100">
                  Featured Data Science Works & Pipelines
                </h2>
                <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>
                  Designing automated analysis engines, statistical predictors, and visual telemetry dashboards.
                </p>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsData.map((project) => (
                  <div
                    id={`project-card-${project.id}`}
                    key={project.id}
                    className={`group p-5 rounded-xl border transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-lg ${
                      isDark
                        ? 'bg-neutral-950/40 border-neutral-900 hover:border-sky-500/30 hover:bg-neutral-950/60 active:scale-[0.995]'
                        : 'bg-neutral-100/20 border-neutral-400/10 hover:border-sky-450/40 hover:bg-white active:scale-[0.995]'
                    }`}
                  >
                    {/* Header: Category & Year */}
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-650 dark:text-neutral-400 font-semibold truncate max-w-[70%]">
                        {project.category}
                      </span>
                      <span className="text-[9.5px] font-mono text-neutral-600 dark:text-neutral-400 select-none whitespace-nowrap">
                        {project.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-sm font-bold tracking-tight mb-2 text-neutral-950 dark:text-neutral-100 flex items-center gap-1.5 leading-snug">
                      <span>{project.title}</span>
                      {project.starred && <span className="w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />}
                    </h3>

                    {/* Description */}
                    <p className={`text-[11px] leading-relaxed mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>
                      {project.description}
                    </p>

                    {/* Footer links */}
                    <div className="flex items-center gap-4 pt-3 mt-auto border-t border-dashed border-neutral-200 dark:border-neutral-800">
                      <a
                        id={`project-link-demo-${project.id}`}
                        href={project.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-0.5 text-[9.5px] font-mono font-semibold tracking-wide uppercase transition-colors group/link ${
                          isDark ? 'text-white hover:text-sky-400' : 'text-neutral-900 hover:text-sky-600'
                        }`}
                      >
                        <span>Inspect Live</span>
                        <ArrowUpRight size={9} className="transition-transform duration-150 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                      <a
                        id={`project-link-repo-${project.id}`}
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[9.5px] font-mono font-semibold tracking-wide uppercase transition-colors ${
                          isDark ? 'text-neutral-400 hover:text-[#f3f4f6]' : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        <span>Repository</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2.6: Resume & Skill Core (Inline) */}
          <section id="resume-section" className="mb-20">
            <div
               className={`rounded-xl border ${
                isDark ? 'bg-neutral-950/20 border-neutral-900' : 'bg-neutral-50/20 border-neutral-200'
              } p-5 sm:p-6 md:p-8 shadow-sm`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: General Academic Profile */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-mono font-semibold">
                      Academic Profile
                    </span>
                    <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight mt-1 text-neutral-950 dark:text-neutral-100">
                      Education & Milestones
                    </h2>
                    
                    <div className="mt-5 relative pl-4 border-l border-neutral-200 dark:border-neutral-800/60 ml-1 space-y-5">
                      <div className="relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[20.5px] top-1.5 w-1.5 h-1.5 rounded-full border ${
                          isDark ? 'bg-neutral-950 border-neutral-600' : 'bg-white border-neutral-450'
                        }`} />
                        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                          B.Tech in Computer Science (Final Year)
                        </p>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>
                          Deep grounding in advanced algorithms, system architecture, and computational methods.
                        </p>
                      </div>
                      <div className="relative">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[20.5px] top-1.5 w-1.5 h-1.5 rounded-full border ${
                          isDark ? 'bg-neutral-950 border-neutral-600' : 'bg-white border-neutral-450'
                        }`} />
                        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                          Aspiring Data Scientist
                        </p>
                        <p className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>
                          Developing automated data cleaning, predictive neural networks, and statistical pipelines.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                    <motion.button
                      id="inline-download-resume-btn"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = '/resume.pdf';
                        link.download = 'Sarfraj_Resume.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      whileHover={{ 
                        y: -1.5,
                        scale: 1.02,
                        boxShadow: isDark 
                          ? '0 8px 16px -8px rgba(255, 255, 255, 0.1)' 
                          : '0 8px 16px -8px rgba(0, 0, 0, 0.1)',
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      className={`py-2.5 px-4.5 rounded-lg font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:cursor-pointer group ${
                        isDark 
                          ? 'bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 hover:border-neutral-700' 
                          : 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Download size={12} className="opacity-85 group-hover:translate-y-0.5 transition-transform duration-150 ease-out" />
                      <span>download resume</span>
                    </motion.button>
                  </div>
                </div>

                {/* Right: Modern Mini Skillset Lists */}
                <div className="lg:col-span-7 col-span-1 space-y-6">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-mono font-semibold block">
                    Technical Core
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      {
                        category: "Machine Learning & AI",
                        techs: ["Python", "Pandas & NumPy", "Scikit-Learn", "PyTorch", "Model Evaluation"]
                      },
                      {
                        category: "Data Systems & Cloud",
                        techs: ["SQL / NoSQL", "PostgreSQL", "Relational Modeling", "FastAPI", "ETL Pipelines"]
                      },
                      {
                        category: "Computer Science",
                        techs: ["Data Structures", "Algorithms", "TypeScript", "React & D3.js", "Statistical Inference"]
                      }
                    ].map((col, idx) => (
                      <div key={idx} className="flex flex-col">
                        <h4 className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-600 dark:text-neutral-400 mb-2.5 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-sky-400" />
                          {col.category}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {col.techs.map((tech) => (
                            <span
                              key={tech}
                              className={`text-[9.5px] font-mono px-2 py-0.5 rounded border transition-all duration-150 ease-out hover:cursor-default select-none ${
                                isDark
                                  ? 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-sky-300 hover:bg-sky-950/35 hover:border-sky-500/40'
                                  : 'bg-neutral-100/50 border-neutral-200 text-neutral-800 hover:text-sky-700 hover:bg-sky-50/70 hover:border-sky-500/30'
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Centered Quick-Connect Card */}
          <div id="recent-posts-anchor" className="flex justify-center mt-12 w-full">
            {/* Have Something Cool In Mind Sidecard */}
            <div
              id="cool-idea-card"
              className={`rounded-2xl border transition-all duration-300 group p-10 shadow-sm flex flex-col justify-between min-h-[340px] w-full max-w-2xl ${
                isDark
                  ? 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700/80 hover:shadow-md'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-4 text-xs">
                  <Workflow size={14} className={isDark ? 'text-sky-450' : 'text-sky-600'} />
                  <span className={`font-mono text-[10px] tracking-widest uppercase font-semibold ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    COLLABORATION
                  </span>
                </div>

                <h4 className="font-display text-xl font-bold tracking-tight mb-3">
                  Have something cool in mind?
                </h4>
                
                <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Whether it is a custom machine learning model, a high-performance database visualizer, or a full-stack application, let's explore how we can engineer it.
                </p>

                {/* Dynamic Message Flow Animation */}
                <div id="message-flow-animation" className={`mt-6 p-5 rounded-2xl border flex flex-col items-center justify-center gap-4 overflow-hidden relative ${
                  isDark 
                    ? 'bg-neutral-950/45 border-neutral-800/70 shadow-inner' 
                    : 'bg-neutral-50/60 border-neutral-200/80 shadow-inner'
                }`}>
                  <div className="flex items-center justify-between w-full max-w-sm px-4 relative mt-2 mb-2">
                    
                    {/* Connecting Line Path */}
                    <div className="absolute top-1/2 left-0 right-0 h-[1.5px] -translate-y-1/2 px-10 z-0">
                      <div className={`w-full h-full border-t border-dashed ${
                        isDark ? 'border-neutral-800' : 'border-neutral-200'
                      }`} />
                    </div>

                    {/* Laser Pulse on the Line */}
                    <div className="absolute top-1/2 left-10 right-10 h-[2px] -translate-y-1/2 z-1 overflow-hidden">
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute h-full w-20 bg-gradient-to-r from-transparent via-sky-500 to-transparent shadow-[0_0_6px_rgba(56,189,248,0.7)]"
                      />
                    </div>

                    {/* Sender Node */}
                    <div className="flex flex-col items-center gap-2 z-10">
                      <motion.div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                          isDark 
                            ? 'bg-neutral-900 border-neutral-800 text-sky-400' 
                            : 'bg-white border-neutral-200/80 text-sky-600'
                        }`}
                        animate={{
                          borderColor: isDark 
                            ? ["#262626", "#0284c7", "#262626"] 
                            : ["#e5e5e5", "#0284c7", "#e5e5e5"]
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          times: [0, 0.2, 0.4]
                        }}
                      >
                        <Send size={15} />
                      </motion.div>
                    </div>

                    {/* Traveling Message Packet */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-2 flex justify-center px-10 pointer-events-none">
                      <div className="w-full relative h-8 flex items-center">
                        <motion.div
                          animate={{
                            left: ["0%", "100%"],
                            opacity: [0, 1, 1, 0],
                            scale: [0.8, 1.1, 1.1, 0.8],
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`absolute -translate-x-1/2 p-1.5 rounded-lg border shadow-lg flex items-center justify-center ${
                            isDark 
                              ? 'bg-neutral-900 border-sky-500/40 text-sky-400' 
                              : 'bg-white border-sky-400 text-sky-600'
                          }`}
                        >
                          <MessageSquare size={11} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Receiver Node */}
                    <div className="flex flex-col items-center gap-2 z-10">
                      <motion.div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                          isDark 
                            ? 'bg-neutral-900 border-neutral-800 text-emerald-400' 
                            : 'bg-white border-neutral-200/80 text-emerald-600'
                        }`}
                        animate={{
                          borderColor: isDark 
                            ? ["#262626", "#262626", "#10b981", "#262626"] 
                            : ["#e5e5e5", "#e5e5e5", "#10b981", "#e5e5e5"]
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          times: [0, 0.6, 0.8, 1]
                        }}
                      >
                        <Sparkles size={15} />
                      </motion.div>
                    </div>
                    
                  </div>

                  {/* Dynamic caption - Minimal pulsing light */}
                  <div className="flex items-center gap-1.5 mt-1 font-medium">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  id="cool-idea-talk-btn"
                  onClick={() => setIsContactOpen(true)}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-250 select-none active:scale-95 hover:cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                    isDark
                      ? 'bg-white text-neutral-950 hover:bg-neutral-100 hover:shadow-neutral-950/20'
                      : 'bg-neutral-950 text-white hover:bg-neutral-900 hover:shadow-neutral-200/15'
                  }`}
                  style={{ userSelect: 'none' }}
                >
                  <span>Let's Talk</span>
                  <ArrowUpRight size={13} className="opacity-90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>


          </div>
        </main>        {/* Section 4: Footers */}
        <footer
          className={`mt-28 pt-12 pb-10 border-t text-[11px] ${
            isDark ? 'border-neutral-900 text-neutral-400' : 'border-neutral-200 text-neutral-700'
          }`}
        >
          {/* Multi-Column Directory */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Branding Column */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <span className="font-display text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100 inline-flex items-center gap-1.5">
                  <span>SARFRAJ</span>
                  <span>SHAIK</span>
                </span>
                <p className="font-mono text-[9px] text-neutral-600 dark:text-neutral-400 mt-0.5 uppercase tracking-widest">
                  Computer Science Student & Aspiring Data Scientist
                </p>
              </div>
              <p className={`text-[11px] leading-relaxed max-w-sm ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>
                Computer Science student exploring software engineering, data analysis, and web development. Passionate about learning new technologies and building useful, functional projects.
              </p>
              {/* External/Social Badges */}
              <div className="flex items-center gap-4.5 pt-1">
                <a
                  href="https://github.com/SarfrajShaik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-300 bg-transparent transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95 hover:bg-neutral-950 dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-neutral-950 dark:hover:border-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_20px_rgba(255,255,255,0.15)]"
                  aria-label="GitHub Profile"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/sarfraj-shaik-3bb603235/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-300 bg-transparent transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-110 active:scale-95 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] hover:shadow-[0_8px_20px_rgba(0,119,181,0.3)]"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin size={18} />
                </a>

              </div>
            </div>

            {/* Sitemap/Index Links */}
            <div className="md:col-span-3 sm:col-span-6 space-y-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-bold">
                Navigation Directory
              </p>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <span
                    onClick={() => {
                      const el = document.getElementById('services-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Domain Focus Areas
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => {
                      const el = document.getElementById('projects-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Data Science Portfolio
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => {
                      const el = document.getElementById('resume-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Academic Core & Skills
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => setIsContactOpen(true)}
                    className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Initiate Discussion
                  </span>
                </li>
              </ul>
            </div>

            {/* Inquiries & Location Metadata */}
            <div className="md:col-span-4 sm:col-span-6 space-y-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-bold">
                Inquiries & Location
              </p>
              <div className="space-y-2.5 text-neutral-700 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-neutral-450 dark:text-neutral-500" />
                  <span className="font-mono text-[10px]">sarfrajshaik08@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-neutral-450 dark:text-neutral-500" />
                  <span>Available for Remote Roles globally</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-neutral-450 dark:text-neutral-500" />
                  <span>English (Professional)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sub Footer Border & Attribution */}
          <div className="pt-6 border-t flex flex-col items-center justify-center gap-4 text-[10px] border-neutral-200 dark:border-neutral-900 text-center">
            <div id="footer-copyright" className="flex items-center justify-center gap-1.5 font-mono text-neutral-600 dark:text-neutral-400 w-full">
              <span>© 2026 Sarfraj Shaik. All rights reserved.</span>
            </div>


          </div>
        </footer>
      </div>

      {/* Global Interactive Drawer Modals */}
      <GetInTouchModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} theme={theme} />
      <BlogPostModal post={selectedPost} onClose={() => setSelectedPost(null)} theme={theme} />
      <SupabaseGuideModal isOpen={isSupabaseModalOpen} onClose={() => setIsSupabaseModalOpen(false)} theme={theme} />

      {/* Floating Back-To-Top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => smoothScrollTo(0, 420)}
            className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-3.5 rounded-full border shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 group hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
              isDark 
                ? 'bg-neutral-900/90 hover:bg-neutral-850 text-white border-white/10 hover:shadow-cyan-950/20' 
                : 'bg-white/90 hover:bg-neutral-50 text-neutral-900 border-neutral-200/80 hover:shadow-neutral-200/30'
            }`}
            aria-label="Back to Top"
            style={{ userSelect: 'none' }}
          >
            <ArrowUp 
              size={18} 
              className="transition-transform duration-300 group-hover:-translate-y-1" 
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
