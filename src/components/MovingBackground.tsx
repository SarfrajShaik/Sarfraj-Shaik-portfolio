import React, { useEffect, useRef } from 'react';

interface MovingBackgroundProps {
  theme: 'dark' | 'light';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  color: string;
}

export default function MovingBackground({ theme }: MovingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000, active: false };

    // Setup canvas size
    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      // Use device pixel ratio for super-crisp drawing on high-DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      initParticles();
    };

    // Initialize particles based on screen density/dimensions
    const initParticles = () => {
      particles = [];
      const density = Math.min(60, Math.floor((width * height) / 24000));
      const colors = isDark 
        ? ['rgba(56, 189, 248, ', 'rgba(20, 184, 166, ', 'rgba(99, 102, 241, ']  // sky, teal, indigo
        : ['rgba(2, 132, 199, ', 'rgba(13, 148, 136, ', 'rgba(79, 70, 229, ']; // sky, teal, indigo

      for (let i = 0; i < density; i++) {
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        const targetAlpha = Math.random() * 0.3 + 0.15; // Soft target opacity
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28, // Ultra-slow drift speed
          vy: (Math.random() - 0.5) * 0.28,
          radius: Math.random() * 2 + 1,
          alpha: 0, // Fade in initially
          targetAlpha,
          color: baseColor,
        });
      }
    };

    // Tracking mouse movements relative to the page
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse positioning relative to document scroll
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Drawing loops
    const animate = () => {
      // Pause drawing if tab is hidden/backgrounded to save battery & CPU resources
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw connecting mesh elements
      const connectionDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            // High-fidelity soft connection lines scaling transparency with distance and node alpha
            const alphaFactor = (1 - dist / connectionDist);
            const lineOpacity = alphaFactor * Math.min(pi.alpha, pj.alpha) * (isDark ? 0.08 : 0.09);
            
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            
            // Draw gradient lines to feel organic and fluid
            const grad = ctx.createLinearGradient(pi.x, pi.y, pj.x, pj.y);
            grad.addColorStop(0, pi.color + lineOpacity + ')');
            grad.addColorStop(1, pj.color + lineOpacity + ')');
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // 2. Update and Draw single particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slowly fade in target alpha for a smoother mounting feel
        if (p.alpha < p.targetAlpha) {
          p.alpha += 0.005;
        }

        // Apply automatic drift velocity
        p.x += p.vx;
        p.y += p.vy;

        // Wrap-around screen bounds with padding
        const padding = 20;
        if (p.x < -padding) p.x = width + padding;
        if (p.x > width + padding) p.x = -padding;
        if (p.y < -padding) p.y = height + padding;
        if (p.y > height + padding) p.y = -padding;

        // Mouse interaction: Gentle repulsion away from mouse pointer
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limitDist = 180;

          if (dist < limitDist) {
            const force = (limitDist - dist) / limitDist;
            // Push direction vector
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * force * 0.45;
            const pushY = Math.sin(angle) * force * 0.45;
            
            p.x += pushX;
            p.y += pushY;
          }
        }

        // Draw node points
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();

        // High-glowing highlights on hover node points close to mouse
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = p.color + (p.alpha * 0.5) + ')';
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Attach listeners
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      id="moving-background-container"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-[0]"
    >
      {/* Dynamic drifting background light orbs */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-700">
        {/* Orb 1: Warm Sky Blue */}
        <div 
          className={`absolute rounded-full filter blur-[100px] sm:blur-[130px] animate-float-slow pointer-events-none transition-colors duration-1000 ${
            isDark 
              ? 'bg-sky-500/8 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] -top-24 -left-20' 
              : 'bg-sky-200/40 w-[350px] h-[350px] sm:w-[480px] sm:h-[480px] -top-20 -left-16'
          }`} 
        />
        
        {/* Orb 2: Deep Indigo */}
        <div 
          className={`absolute rounded-full filter blur-[110px] sm:blur-[140px] animate-float-slower pointer-events-none transition-colors duration-1000 ${
            isDark 
              ? 'bg-indigo-500/7 w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] top-1/3 -right-32' 
              : 'bg-indigo-100/35 w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] top-1/4 -right-24'
          }`} 
        />

        {/* Orb 3: Tech Teal */}
        <div 
          className={`absolute rounded-full filter blur-[100px] sm:blur-[130px] animate-float-slowest pointer-events-none transition-colors duration-1000 ${
            isDark 
              ? 'bg-teal-500/6 w-[350px] h-[350px] sm:w-[480px] sm:h-[480px] bottom-1/4 -left-40' 
              : 'bg-teal-50/45 w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] bottom-1/3 -left-32'
          }`} 
        />

        {/* Orb 4: Subtler cosmic core center orb strictly behind the grid and content */}
        <div 
          className={`absolute rounded-full filter blur-[120px] sm:blur-[150px] animate-float-slow pointer-events-none transition-colors duration-1000 ${
            isDark 
              ? 'bg-sky-500/3 w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] bottom-10 right-20' 
              : 'bg-sky-100/20 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] bottom-20 right-24'
          }`} 
        />
      </div>

      {/* Interactive canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
}
