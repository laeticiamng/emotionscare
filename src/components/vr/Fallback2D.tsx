// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import { VRBreathPattern } from '@/store/vrbreath.store';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface Fallback2DProps {
  pattern: VRBreathPattern;
  reducedMotion: boolean;
  onStart: () => void;
  onPause: () => void;
  onFinish: () => void;
  running?: boolean;
  currentPhase?: { type: 'inhale' | 'hold' | 'exhale'; duration: number };
  phaseProgress?: number;
}

const PATTERNS = {
  '4-2-4': [
    { type: 'inhale' as const, duration: 4 },
    { type: 'hold' as const, duration: 2 },
    { type: 'exhale' as const, duration: 4 }
  ],
  '4-6-8': [
    { type: 'inhale' as const, duration: 4 },
    { type: 'hold' as const, duration: 6 },
    { type: 'exhale' as const, duration: 8 }
  ],
  '5-5': [
    { type: 'inhale' as const, duration: 5 },
    { type: 'exhale' as const, duration: 5 }
  ]
};

export const Fallback2D: React.FC<Fallback2DProps> = ({
  pattern,
  reducedMotion,
  onStart,
  onPause,
  onFinish,
  running = false,
  currentPhase,
  phaseProgress = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawPacer = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Center
      const centerX = width / 2;
      const centerY = height / 2;

      // Base radius and animation
      const baseRadius = Math.min(width, height) * 0.15;
      let currentRadius = baseRadius;

      if (running && currentPhase) {
        const progress = phaseProgress;
        
        switch (currentPhase.type) {
          case 'inhale':
            currentRadius = baseRadius + (baseRadius * 0.5 * progress);
            break;
          case 'hold':
            currentRadius = baseRadius * 1.5;
            break;
          case 'exhale':
            currentRadius = baseRadius * 1.5 - (baseRadius * 0.5 * progress);
            break;
        }
      }

      // Draw pacer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      
      // Gradient based on phase
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentRadius);
      
      if (currentPhase) {
        switch (currentPhase.type) {
          case 'inhale':
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)'); // blue
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
            break;
          case 'hold':
            gradient.addColorStop(0, 'rgba(168, 85, 247, 0.8)'); // purple
            gradient.addColorStop(1, 'rgba(168, 85, 247, 0.2)');
            break;
          case 'exhale':
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)'); // green
            gradient.addColorStop(1, 'rgba(34, 197, 94, 0.2)');
            break;
        }
      } else {
        gradient.addColorStop(0, 'rgba(156, 163, 175, 0.8)'); // gray
        gradient.addColorStop(1, 'rgba(156, 163, 175, 0.2)');
      }

      ctx.fillStyle = gradient;
      ctx.fill();

      // Phase text
      if (currentPhase) {
        ctx.fillStyle = 'hsl(var(--foreground))';
        ctx.font = '2rem system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const phaseText = currentPhase.type === 'inhale' ? 'Inspire' :
                         currentPhase.type === 'hold' ? 'Retiens' : 'Expire';
        
        ctx.fillText(phaseText, centerX, centerY + currentRadius + 60);
      }
    };

    // Resize canvas to match display size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      drawPacer();
      if (!reducedMotion) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [running, currentPhase, phaseProgress, reducedMotion]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          if (running) {
            onPause();
          } else {
            onStart();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onFinish();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [running, onStart, onPause, onFinish]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-background to-muted">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />
      
      {/* Controls overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-4 bg-background/80 backdrop-blur-sm rounded-full px-6 py-3 border">
          <Button
            variant="ghost"
            size="icon"
            onClick={running ? onPause : onStart}
            className="h-12 w-12"
            aria-label={running ? 'Mettre en pause' : 'Démarrer la respiration'}
          >
            {running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onFinish}
            className="h-12 w-12"
            aria-label="Arrêter la session"
          >
            <Square className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Pattern info */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 border">
          <p className="text-sm text-muted-foreground">Pattern {pattern}</p>
        </div>
      </div>
    </div>
  );
};

export default Fallback2D;