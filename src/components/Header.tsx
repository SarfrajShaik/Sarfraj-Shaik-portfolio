import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Download, Mail, ExternalLink, Menu, X, Moon, Laptop, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  theme: 'dark' | 'light';
  activeSection: string;
  onNavClick: (section: 'about' | 'projects' | 'resume') => void;
  onContactClick: () => void;
}

export default function Header({ theme, activeSection, onNavClick, onContactClick }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === 'dark';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const menuItems = [
    { label: 'About', value: 'about' },
    { label: 'Projects', value: 'projects' },
    { label: 'Resume', value: 'resume' },
  ];

  const handleNav = (val: 'about' | 'projects' | 'resume') => {
    onNavClick(val);
    setMobileMenuOpen(false);
  };

  const playFuturisticChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (
        freq: number,
        start: number,
        duration: number,
        type: 'sine' | 'triangle' | 'square' | 'sawtooth' = 'sine',
        volume = 0.05
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(volume, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      const now = ctx.currentTime;
      // Ultra-premium modern minimalist acoustic signature - elevated levels for optimal audibility
      // Tone 1: E6 (1318.51 Hz) - crisp, high-tech definition peak
      playTone(1318.51, now, 0.20, 'sine', 0.08);
      // Tone 2: B6 (1975.53 Hz) - bright atmospheric harmonic echo
      playTone(1975.53, now + 0.03, 0.22, 'sine', 0.07);
      // Tone 3: A5 (880.00 Hz) - rich warm intermediate body
      playTone(880.00, now, 0.25, 'triangle', 0.05);
    } catch (e) {
      console.warn("Audio Context is currently blocked or not enabled:", e);
    }
  };

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ease-out ${
        scrolled 
          ? isDark 
            ? 'bg-[#212529]/90 backdrop-blur-md border-b border-[#3E444B]/30 py-3.5 shadow-md' 
            : 'bg-[#F1FAEE]/90 backdrop-blur-md border-b border-[#CED4DA]/50 py-3.5 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => {
            handleNav('about');
            playFuturisticChime();
          }}
          className="cursor-pointer group flex items-center font-display text-xl font-extrabold tracking-tight select-none"
          style={{ 
            userSelect: 'none', 
            WebkitUserSelect: 'none', 
            MozUserSelect: 'none', 
            msUserSelect: 'none' 
          }}
        >
          <motion.span
            id="logo-text-span"
            initial={{ opacity: 0, x: -8, letterSpacing: '0.08em' }}
            animate={{ opacity: 1, x: 0, letterSpacing: '0.08em' }}
            whileHover={{ 
              scale: 1.03, 
              letterSpacing: '0.15em'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ 
              type: 'spring', 
              stiffness: 280, 
              damping: 20,
              letterSpacing: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
            className={`cursor-pointer text-xl sm:text-2xl uppercase font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r select-none ${
              isDark 
                ? 'from-sky-400 via-indigo-200 to-teal-300' 
                : 'from-neutral-950 via-blue-700 to-sky-600'
            }`}
            style={{ 
              userSelect: 'none', 
              WebkitUserSelect: 'none', 
              MozUserSelect: 'none', 
              msUserSelect: 'none' 
            }}
          >
            sarfraj shaik
          </motion.span>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-navigation" className="hidden md:flex items-center gap-1">
          <div
            className={`flex items-center gap-1 rounded-full p-1 border relative ${
              isDark
                ? 'bg-neutral-900/40 border-neutral-800/80'
                : 'bg-white border-neutral-200'
            }`}
          >
            {menuItems.map((item) => {
              const isActive = activeSection === item.value;
              return (
                <div
                  key={item.value}
                  className="relative w-24 flex justify-center"
                >
                  <motion.button
                    id={`nav-item-${item.value}`}
                    onClick={() => handleNav(item.value as any)}
                    whileHover={{ scale: 1.05, y: -0.5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className={`relative z-10 w-full text-center py-1.5 rounded-full text-xs font-semibold select-none cursor-pointer transition-all duration-150 ease-out ${
                      isActive
                        ? 'text-white font-extrabold'
                        : isDark
                        ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                        : 'text-neutral-500 hover:text-black hover:bg-neutral-100/70'
                    }`}
                  >
                    {item.label}
                  </motion.button>

                  {/* Active Slide pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute inset-0 rounded-full z-0 ${
                        isDark ? 'bg-neutral-800 shadow-inner' : 'bg-neutral-950 shadow-sm'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* More Dropdown Options */}
          <div className="relative ml-2" ref={dropdownRef}>
            <motion.button
              id="more-options-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              whileHover={{ scale: 1.08, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              whileTap={{ scale: 0.93 }}
              className={`p-2 rounded-full border transition-all duration-150 ease-out cursor-pointer ${
                isDark
                  ? 'border-neutral-800 hover:border-sky-500 bg-neutral-900/20 text-neutral-400 hover:text-sky-400 hover:bg-neutral-900/60'
                  : 'border-neutral-200 hover:border-sky-500 bg-white text-neutral-500 hover:text-sky-600 hover:bg-sky-50/50'
              }`}
            >
              <MoreHorizontal size={14} />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-15" onClick={() => setDropdownOpen(false)} />
                  <motion.div
                    id="more-dropdown-panel"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl border p-2 shadow-lg z-20 ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800 text-neutral-300'
                        : 'bg-white border-neutral-200 text-neutral-700'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onContactClick();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between text-left px-3 py-2 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <span>Connect with SARFRAJ</span>
                      <Mail size={12} />
                    </button>
                     <button
                      onClick={(e) => {
                        e.preventDefault();
                        const link = document.createElement('a');
                        link.href = '/resume.pdf';
                        link.download = 'Sarfraj_Resume.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between text-left px-3 py-2 text-xs rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-neutral-700 dark:text-neutral-300"
                    >
                      <span>Download Resume</span>
                      <Download size={12} />
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`group p-2 rounded-lg border transition-all duration-300 active:scale-95 hover:scale-105 hover:cursor-pointer flex items-center justify-center ${
              mobileMenuOpen
                ? 'border-sky-500/50 bg-sky-950/20 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-sky-500/40 hover:text-sky-300 hover:bg-neutral-900 hover:shadow-[0_0_12px_rgba(56,189,248,0.12)]'
            }`}
            aria-label="Toggle Menu"
          >
            <div className="transition-transform duration-300 transform group-hover:rotate-90 flex items-center justify-center">
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden mt-4 rounded-xl border p-4 shadow-lg ${
              isDark
                ? 'bg-neutral-950 border-neutral-850 text-neutral-200'
                : 'bg-white border-neutral-200 text-neutral-800'
            }`}
          >
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1 px-3">
                Main Menu
              </span>
              {menuItems.map((item) => (
                <button
                  id={`mobile-nav-${item.value}`}
                  key={item.value}
                  onClick={() => handleNav(item.value as any)}
                  className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.value
                      ? isDark
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'bg-neutral-100 text-black font-semibold'
                      : isDark
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-neutral-100 dark:border-neutral-800 my-2 pt-2 space-y-1">
                <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mb-1 px-3 block">
                  Resources & Contact
                </span>
                
                 <button
                  onClick={(e) => {
                    e.preventDefault();
                    const link = document.createElement('a');
                    link.href = '/resume.pdf';
                    link.download = 'Sarfraj_Resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between text-left py-2 px-3 rounded-lg text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-neutral-700 dark:text-neutral-300"
                >
                  <span>Download CV</span>
                  <Download size={12} />
                </button>


                <div className="pt-2">
                  <button
                    id="mobile-contact-trigger"
                    onClick={() => {
                      onContactClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between text-left py-2 px-3 rounded-lg text-xs font-semibold bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-900 active:scale-[0.98] transition-all"
                  >
                    <span>Get in touch</span>
                    <Mail size={12} />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
}
