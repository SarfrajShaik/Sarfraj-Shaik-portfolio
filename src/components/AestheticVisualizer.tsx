import React, { useState, useEffect, useRef } from 'react';

interface AestheticVisualizerProps {
  theme: 'dark' | 'light';
}

interface Cubie {
  id: number;
  x: number;
  y: number;
  z: number;
  colors: {
    u: string; // up
    d: string; // down
    l: string; // left
    r: string; // right
    f: string; // front
    b: string; // back
  };
}

export default function AestheticVisualizer({ theme }: AestheticVisualizerProps) {
  const isDark = theme === 'dark';

  // State mapping a single highly cohesive, professional palette design
  // Light blue, dark blue, light green, white, maroon red, and yellow for the six sides
  const palette = {
    u: isDark 
      ? 'bg-zinc-50 border-zinc-200/40 shadow shadow-white/5' 
      : 'bg-white border-zinc-300 shadow shadow-black/5', // Pure Alabaster Gold-Tinge
    d: 'bg-[#eab308]/90 border-[#ca8a04]/80 shadow-md shadow-[#eab308]/10', // Pure Technical Yellow
    l: 'bg-[#38bdf8]/90 border-[#0284c7]/80 shadow-md shadow-[#38bdf8]/10', // Cool Light Blue
    r: 'bg-[#1d4ed8]/90 border-[#1e40af]/80 shadow-md shadow-[#1d4ed8]/10', // Corporate Dark Blue
    f: 'bg-[#4ade80]/90 border-[#16a34a]/80 shadow-md shadow-[#4ade80]/10', // Minty Light Green
    b: 'bg-[#881337]/90 border-[#9f1239]/80 shadow-md shadow-[#881337]/10', // Imperial Maroon Red
  };

  const [cubies, setCubies] = useState<Cubie[]>([]);
  
  interface Move {
    face: 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
    clockwise: boolean;
  }

  const scrambleHistoryRef = useRef<Move[]>([]);

  const [mode, setMode] = useState<'SCRAMBLING' | 'SOLVING' | 'SOLVED'>('SCRAMBLING');

  // Twist animation state machines
  const [animatingFace, setAnimatingFace] = useState<string | null>(null);
  const [animatingAngle, setAnimatingAngle] = useState<number>(0);

  // Initialize Solved Cubie structural configuration
  const initSolvedCube = () => {
    const list: Cubie[] = [];
    let idCounter = 1;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          list.push({
            id: idCounter++,
            x,
            y,
            z,
            colors: {
              u: y === -1 ? palette.u : 'transparent',
              d: y === 1 ? palette.d : 'transparent',
              l: x === -1 ? palette.l : 'transparent',
              r: x === 1 ? palette.r : 'transparent',
              f: z === 1 ? palette.f : 'transparent',
              b: z === -1 ? palette.b : 'transparent',
            }
          });
        }
      }
    }
    setCubies(list);
  };

  useEffect(() => {
    initSolvedCube();
  }, [theme]); // Re-initialize colors when the system light/dark theme switches

  // Helper to update state coordinates and facial index colors on twisting
  const applyMoveState = (face: 'U' | 'D' | 'L' | 'R' | 'F' | 'B', clockwise: boolean) => {
    setCubies((currentCubies) => {
      return currentCubies.map((c) => {
        let isMoving = false;
        switch (face) {
          case 'U': isMoving = c.y === -1; break;
          case 'D': isMoving = c.y === 1; break;
          case 'L': isMoving = c.x === -1; break;
          case 'R': isMoving = c.x === 1; break;
          case 'F': isMoving = c.z === 1; break;
          case 'B': isMoving = c.z === -1; break;
        }

        if (!isMoving) return c;

        const updated = { ...c };
        const { x, y, z, colors } = c;

        // Perform swift rotation index swaps and color side alignments
        if (face === 'U') {
          if (clockwise) {
            updated.x = -z;
            updated.z = x;
            updated.colors = { ...colors, f: colors.r, r: colors.b, b: colors.l, l: colors.f };
          } else {
            updated.x = z;
            updated.z = -x;
            updated.colors = { ...colors, f: colors.l, l: colors.b, b: colors.r, r: colors.f };
          }
        } else if (face === 'D') {
          if (clockwise) {
            updated.x = z;
            updated.z = -x;
            updated.colors = { ...colors, f: colors.l, l: colors.b, b: colors.r, r: colors.f };
          } else {
            updated.x = -z;
            updated.z = x;
            updated.colors = { ...colors, f: colors.r, r: colors.b, b: colors.l, l: colors.f };
          }
        } else if (face === 'R') {
          if (clockwise) {
            updated.y = z;
            updated.z = y === 0 ? 0 : -y;
            updated.colors = { ...colors, u: colors.f, f: colors.d, d: colors.b, b: colors.u };
          } else {
            updated.y = -z;
            updated.z = y;
            updated.colors = { ...colors, u: colors.b, b: colors.d, d: colors.f, f: colors.u };
          }
        } else if (face === 'L') {
          if (clockwise) {
            updated.y = -z;
            updated.z = y;
            updated.colors = { ...colors, u: colors.b, b: colors.d, d: colors.f, f: colors.u };
          } else {
            updated.y = z;
            updated.z = -y;
            updated.colors = { ...colors, u: colors.f, f: colors.d, d: colors.b, b: colors.u };
          }
        } else if (face === 'F') {
          if (clockwise) {
            updated.x = -y;
            updated.y = x;
            updated.colors = { ...colors, u: colors.l, l: colors.d, d: colors.r, r: colors.u };
          } else {
            updated.x = y;
            updated.y = -x;
            updated.colors = { ...colors, u: colors.r, r: colors.d, d: colors.l, l: colors.u };
          }
        } else if (face === 'B') {
          if (clockwise) {
            updated.x = y;
            updated.y = -x;
            updated.colors = { ...colors, u: colors.r, r: colors.d, d: colors.l, l: colors.u };
          } else {
            updated.x = -y;
            updated.y = x;
            updated.colors = { ...colors, u: colors.l, l: colors.d, d: colors.r, r: colors.u };
          }
        }

        return updated;
      });
    });
  };

  // Coordinated realistic auto-scrambler & auto-solver loop scheduler
  useEffect(() => {
    if (cubies.length === 0) return;

    let isDestroyed = false;

    const animateAndCommitTwist = async (face: 'U' | 'D' | 'L' | 'R' | 'F' | 'B', clockwise: boolean) => {
      if (isDestroyed) return;

      setAnimatingFace(face);
      setAnimatingAngle(clockwise ? 90 : -90);

      // Smooth custom timing: 320ms animation with high-fidelity easing
      await new Promise((resolve) => setTimeout(resolve, 320));

      if (isDestroyed) return;

      applyMoveState(face, clockwise);
      setAnimatingFace(null);
      setAnimatingAngle(0);

      // Stabilization brief delay
      await new Promise((resolve) => setTimeout(resolve, 120));
    };

    const runOrchestrator = async () => {
      while (!isDestroyed) {
        // --- 1. SHUFFLING PHASE ---
        setMode('SCRAMBLING');
        const numScrambleMoves = 7;
        const faces: ('U' | 'D' | 'L' | 'R' | 'F' | 'B')[] = ['U', 'D', 'L', 'R', 'F', 'B'];
        
        for (let i = 0; i < numScrambleMoves; i++) {
          if (isDestroyed) return;
          const face = faces[Math.floor(Math.random() * faces.length)];
          const clockwise = Math.random() > 0.45;
          
          scrambleHistoryRef.current.push({ face, clockwise });
          await animateAndCommitTwist(face, clockwise);
          
          if (isDestroyed) return;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Short dramatic pause at scrambled state
        if (isDestroyed) return;
        await new Promise((resolve) => setTimeout(resolve, 650));

        // --- 2. SOLVING PHASE ---
        setMode('SOLVING');
        while (scrambleHistoryRef.current.length > 0) {
          if (isDestroyed) return;
          const lastMove = scrambleHistoryRef.current.pop();
          if (lastMove) {
            await animateAndCommitTwist(lastMove.face, !lastMove.clockwise);
          }
          if (isDestroyed) return;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // --- 3. SOLVED CELEBRATION PHASE ---
        setMode('SOLVED');
        initSolvedCube(); // Force exact alignments to clear floating-point twist offsets
        
        if (isDestroyed) return;
        // Hold solved state on loop beautifully
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    };

    runOrchestrator();

    return () => {
      isDestroyed = true;
    };
  }, [cubies.length === 0]);

  const getStyleForCubie = (c: Cubie) => {
    const size = 54; // Medium dimension of individual cubies
    const space = 1.12; // Spacing factor
    
    let inlineX = c.x * size * space;
    let inlineY = c.y * size * space;
    let inlineZ = c.z * size * space;
    
    let transformStr = `translate3d(${inlineX}px, ${inlineY}px, ${inlineZ}px)`;

    if (animatingFace !== null) {
      const isRotating = 
        (animatingFace === 'U' && c.y === -1) ||
        (animatingFace === 'D' && c.y === 1) ||
        (animatingFace === 'L' && c.x === -1) ||
        (animatingFace === 'R' && c.x === 1) ||
        (animatingFace === 'F' && c.z === 1) ||
        (animatingFace === 'B' && c.z === -1);

      if (isRotating) {
        let rotationStr = '';
        if (animatingFace === 'U' || animatingFace === 'D') {
          rotationStr = `rotateY(${animatingAngle}deg)`;
        } else if (animatingFace === 'L' || animatingFace === 'R') {
          rotationStr = `rotateX(${animatingAngle}deg)`;
        } else if (animatingFace === 'F' || animatingFace === 'B') {
          rotationStr = `rotateZ(${animatingAngle}deg)`;
        }
        
        transformStr = `${rotationStr} ${transformStr}`;
      }
    }

    return {
      transform: transformStr,
      width: `${size}px`,
      height: `${size}px`,
      transition: animatingFace ? 'transform 320ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
    };
  };

  const currentSize = 54;
  const translateZVal = (currentSize / 2).toFixed(1);

  return (
    <div
      id="aesthetic-visualizer-card"
      className="relative w-full h-[380px] md:h-[450px] flex items-center justify-center select-none overflow-visible pointer-events-none"
      style={{ perspective: '1100px' }}
    >
      {/* Dynamic Ambient Blur Ground Shadow that reacts to the height of the orbit */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44 h-5 rounded-full bg-neutral-900/10 dark:bg-black/40 blur-lg pointer-events-none"
        style={{
          transform: 'translateX(-50%) rotateX(75deg)',
          animation: 'shadowPulse 16s ease-in-out infinite'
        }}
      />

      {/* Self-contained CSS injection for hardware-accelerated, buttery smooth translation loops */}
      <style>{`
        @keyframes cubeFloatingOrbit {
          0% {
            transform: translate3d(0, 0px, 0) rotateX(-20deg) rotateY(15deg) rotateZ(10deg);
          }
          25% {
            transform: translate3d(0, -12px, 25px) rotateX(70deg) rotateY(105deg) rotateZ(85deg);
          }
          50% {
            transform: translate3d(0, 6px, -20px) rotateX(160deg) rotateY(195deg) rotateZ(160deg);
          }
          75% {
            transform: translate3d(0, -10px, 20px) rotateX(250deg) rotateY(285deg) rotateZ(250deg);
          }
          100% {
            transform: translate3d(0, 0px, 0) rotateX(340deg) rotateY(375deg) rotateZ(370deg);
          }
        }
        @keyframes shadowPulse {
          0%, 100% {
            transform: translateX(-50%) scale(0.9) rotateX(75deg);
            opacity: 0.55;
          }
          25% {
            transform: translateX(-50%) scale(0.75) rotateX(75deg);
            opacity: 0.35;
          }
          50% {
            transform: translateX(-50%) scale(1.02) rotateX(75deg);
            opacity: 0.65;
          }
          75% {
            transform: translateX(-50%) scale(0.8) rotateX(75deg);
            opacity: 0.45;
          }
        }
        .animate-cube-loop {
          animation: cubeFloatingOrbit 16s ease-in-out infinite;
        }
      `}</style>

      {/* 3D Master Assembly */}
      <div
        className="animate-cube-loop relative scale-95 sm:scale-105"
        style={{
          transformStyle: 'preserve-3d',
          width: '150px',
          height: '150px'
        }}
      >
        {cubies.map((cubie) => {
          const isCenterCore = cubie.x === 0 && cubie.y === 0 && cubie.z === 0;
          if (isCenterCore) return null;

          const cubieStyle = getStyleForCubie(cubie);

          return (
            <div
              key={cubie.id}
              className="absolute"
              style={{
                ...cubieStyle,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* 6 Face Panels with elegant styling */}
              
              {/* UP Face */}
              <div 
                className={`absolute inset-0 rounded-[4.5px] border-[1.5px] transition-colors duration-300 ${cubie.colors.u} ${
                  cubie.y === -1 ? 'border-neutral-900/40 dark:border-neutral-950/65 shadow-inner' : 'border-transparent'
                }`}
                style={{ transform: `rotateX(90deg) translateZ(${translateZVal}px)`, transformStyle: 'preserve-3d' }}
              />

              {/* DOWN Face */}
              <div 
                className={`absolute inset-0 rounded-[4.5px] border-[1.5px] transition-colors duration-300 ${cubie.colors.d} ${
                  cubie.y === 1 ? 'border-neutral-900/40 dark:border-neutral-950/65 shadow-inner' : 'border-transparent'
                }`}
                style={{ transform: `rotateX(-90deg) translateZ(${translateZVal}px)`, transformStyle: 'preserve-3d' }}
              />

              {/* LEFT Face */}
              <div 
                className={`absolute inset-0 rounded-[4.5px] border-[1.5px] transition-colors duration-300 ${cubie.colors.l} ${
                  cubie.x === -1 ? 'border-neutral-900/40 dark:border-neutral-950/65 shadow-inner' : 'border-transparent'
                }`}
                style={{ transform: `rotateY(-90deg) translateZ(${translateZVal}px)`, transformStyle: 'preserve-3d' }}
              />

              {/* RIGHT Face */}
              <div 
                className={`absolute inset-0 rounded-[4.5px] border-[1.5px] transition-colors duration-300 ${cubie.colors.r} ${
                  cubie.x === 1 ? 'border-neutral-900/40 dark:border-neutral-950/65 shadow-inner' : 'border-transparent'
                }`}
                style={{ transform: `rotateY(90deg) translateZ(${translateZVal}px)`, transformStyle: 'preserve-3d' }}
              />

              {/* FRONT Face */}
              <div 
                className={`absolute inset-0 rounded-[4.5px] border-[1.5px] transition-colors duration-300 ${cubie.colors.f} ${
                  cubie.z === 1 ? 'border-neutral-900/40 dark:border-neutral-950/65 shadow-inner' : 'border-transparent'
                }`}
                style={{ transform: `rotateY(0deg) translateZ(${translateZVal}px)`, transformStyle: 'preserve-3d' }}
              />

              {/* BACK Face */}
              <div 
                className={`absolute inset-0 rounded-[4.5px] border-[1.5px] transition-colors duration-300 ${cubie.colors.b} ${
                  cubie.z === -1 ? 'border-neutral-900/40 dark:border-neutral-950/65 shadow-inner' : 'border-transparent'
                }`}
                style={{ transform: `rotateY(180deg) translateZ(${translateZVal}px)`, transformStyle: 'preserve-3d' }}
              />

              {/* Ambient inner core shading */}
              <div className="absolute inset-px rounded-[3.5px] pointer-events-none bg-neutral-950/20" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
