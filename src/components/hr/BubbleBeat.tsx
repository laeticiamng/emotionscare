// @ts-nocheck
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  phase: number;
  pulseStrength: number;
}

interface BubbleBeatProps {
  bpm?: number;
  reducedMotion?: boolean;
  className?: string;
}

const BubbleBeat: React.FC<BubbleBeatProps> = ({ 
  bpm, 
  reducedMotion = false, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const lastBeatRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate beat interval from BPM
  const beatInterval = bpm ? (60 / bpm) * 1000 : 1000; // ms between beats

  // Initialize bubbles
  const initializeBubbles = useCallback((canvas: HTMLCanvasElement) => {
    const bubbleCount = reducedMotion ? 40 : 80;
    bubblesRef.current = [];

    for (let i = 0; i < bubbleCount; i++) {
      bubblesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0.5 : 1),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0.5 : 1),
        radius: 8 + Math.random() * (reducedMotion ? 12 : 20),
        opacity: 0.3 + Math.random() * 0.4,
        hue: 200 + Math.random() * 60, // Blue-green range
        phase: Math.random() * Math.PI * 2,
        pulseStrength: 0.5 + Math.random() * 0.5,
      });
    }
  }, [reducedMotion]);

  // Update bubble physics
  const updateBubbles = useCallback((canvas: HTMLCanvasElement, deltaTime: number) => {
    const currentTime = Date.now();
    const timeSinceBeat = currentTime - lastBeatRef.current;
    const beatProgress = (timeSinceBeat % beatInterval) / beatInterval;
    
    // Create pulse wave based on BPM
    const pulseIntensity = bpm ? Math.sin(beatProgress * Math.PI * 2) * 0.5 + 0.5 : 0.3;
    
    bubblesRef.current.forEach((bubble) => {
      // Update position
      bubble.x += bubble.vx * (reducedMotion ? 0.5 : 1);
      bubble.y += bubble.vy * (reducedMotion ? 0.5 : 1);
      
      // Bounce off walls
      if (bubble.x < 0 || bubble.x > canvas.width) {
        bubble.vx *= -1;
        bubble.x = Math.max(0, Math.min(canvas.width, bubble.x));
      }
      if (bubble.y < 0 || bubble.y > canvas.height) {
        bubble.vy *= -1;
        bubble.y = Math.max(0, Math.min(canvas.height, bubble.y));
      }
      
      // Update pulse phase
      bubble.phase += deltaTime * 0.002 * (reducedMotion ? 0.5 : 1);
      
      // Pulse with heart rate
      const basePulse = Math.sin(bubble.phase) * 0.2;
      const heartPulse = pulseIntensity * bubble.pulseStrength * 0.3;
      bubble.radius = (8 + Math.random() * 12) * (1 + basePulse + heartPulse);
    });
  }, [beatInterval, bpm, reducedMotion]);

  // Render bubbles
  const renderBubbles = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear canvas with subtle background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'; // Very subtle dark overlay
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    bubblesRef.current.forEach((bubble) => {
      ctx.save();
      
      // Create radial gradient for each bubble
      const gradient = ctx.createRadialGradient(
        bubble.x, bubble.y, 0,
        bubble.x, bubble.y, bubble.radius
      );
      
      gradient.addColorStop(0, `hsla(${bubble.hue}, 70%, 70%, ${bubble.opacity})`);
      gradient.addColorStop(0.7, `hsla(${bubble.hue}, 60%, 50%, ${bubble.opacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${bubble.hue}, 50%, 30%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }, []);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    const deltaTime = currentTime - lastFrameTimeRef.current;
    lastFrameTimeRef.current = currentTime;
    
    updateBubbles(canvas, deltaTime);
    renderBubbles(ctx, canvas);
    
    animationRef.current = requestAnimationFrame(animate);
  }, [updateBubbles, renderBubbles]);

  // Handle canvas resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const { width, height } = container.getBoundingClientRect();
    
    // Set actual size (with device pixel ratio for sharp rendering)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale the context to match device pixel ratio
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    // Set CSS size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Reinitialize bubbles with new dimensions
    initializeBubbles(canvas);
  }, [initializeBubbles]);

  // Initialize on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    resizeCanvas();
    setIsInitialized(true);
    
    // Start animation
    lastFrameTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
    
    // Handle window resize
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, resizeCanvas]);

  // Update beat timing when BPM changes
  useEffect(() => {
    if (bpm) {
      lastBeatRef.current = Date.now();
    }
  }, [bpm]);

  return (
    <div className={`bubble-beat ${className}`}>
      <div className="relative w-full h-full min-h-[300px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label="Animation de rythme cardiaque avec des bulles pulsantes"
        />
        
        {/* BPM indicator (only visible to screen readers) */}
        <div className="sr-only" aria-live="polite">
          {bpm ? `Rythme cardiaque: ${bpm} battements par minute` : 'Mode démonstration'}
        </div>
        
        {/* Demo indicator */}
        {!bpm && (
          <div className="absolute top-4 left-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs text-white/80">Mode démo</span>
            </div>
          </div>
        )}
        
        {/* Reduced motion indicator */}
        {reducedMotion && (
          <div className="absolute bottom-4 right-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs text-white/60">Animation réduite</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BubbleBeat;