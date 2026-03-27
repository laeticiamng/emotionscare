// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, Palette, Sparkles, Waves, Disc3 } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import ThreeDVisualizer from './ThreeDVisualizer';
import AmbientBackground from './AmbientBackground';
import PremiumMusicPlayer from './PremiumMusicPlayer';
import { logger } from '@/lib/logger';
import '@/styles/premium-3d-player.css';

// --- Premium Particle Field (replaces div animate-pulse) ---
const PARTICLE_COUNT = 80;

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  phase: number;
}

const generateParticles = (): Particle[] =>
  Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    opacity: 0.15 + Math.random() * 0.45,
    speed: 0.15 + Math.random() * 0.4,
    drift: (Math.random() - 0.5) * 0.3,
    phase: Math.random() * Math.PI * 2,
  }));

const PremiumParticleField: React.FC<{ isPlaying: boolean }> = memo(({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>(generateParticles());
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      timeRef.current += isPlaying ? 0.008 : 0.003;
      const t = timeRef.current;

      particlesRef.current.forEach((p) => {
        p.y -= p.speed * (isPlaying ? 1.2 : 0.5);
        p.x += p.drift + Math.sin(t + p.phase) * 0.08;

        if (p.y < -2) { p.y = 102; p.x = Math.random() * 100; }
        if (p.x < -2) p.x = 102;
        if (p.x > 102) p.x = -2;

        const px = (p.x / 100) * w;
        const py = (p.y / 100) * h;
        const pulse = isPlaying ? 0.3 * Math.sin(t * 3 + p.phase) : 0;
        const alpha = Math.max(0.05, p.opacity + pulse);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Subtle glow
        if (p.size > 2) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 160, 255, ${alpha * 0.12})`;
          ctx.fill();
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'linear-gradient(135deg, #1a0533 0%, #0a1628 40%, #0d0d2b 100%)' }}
    />
  );
});
PremiumParticleField.displayName = 'PremiumParticleField';

// --- Main Component ---

interface ImmersiveFullscreenPlayerProps {
  className?: string;
}

const ImmersiveFullscreenPlayer: React.FC<ImmersiveFullscreenPlayerProps> = ({ className }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visualMode, setVisualMode] = useState<'3d' | 'ambient' | 'particles' | 'wave'>('3d');
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const { state } = useMusic();
  const currentTrack = state.currentTrack;
  const isPlaying = state.isPlaying;

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      logger.info('Fullscreen toggle failed');
    }
  }, []);

  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);
    if (isFullscreen) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const move = resetHideTimer;
    document.addEventListener('mousemove', move);
    document.addEventListener('keydown', move);
    resetHideTimer();
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('keydown', move);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isFullscreen, resetHideTimer]);

  const visualModes = useMemo(() => [
    { id: '3d' as const, icon: Sparkles, label: '3D' },
    { id: 'ambient' as const, icon: Palette, label: 'Ambient' },
    { id: 'particles' as const, icon: Disc3, label: 'Particles' },
    { id: 'wave' as const, icon: Waves, label: 'Wave' },
  ], []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'player-glass-frame relative overflow-hidden select-none',
        isFullscreen
          ? 'player-glass-frame--fullscreen fixed inset-0 z-[9999] bg-black'
          : 'aspect-video',
        className
      )}
      onMouseMove={resetHideTimer}
    >
      {/* Background Visuel */}
      <div className="absolute inset-0">
        {visualMode === '3d' && (
          <ThreeDVisualizer
            isPlaying={isPlaying}
            track={currentTrack}
            fullscreen={isFullscreen}
          />
        )}
        {visualMode === 'ambient' && (
          <AmbientBackground
            track={currentTrack}
            isPlaying={isPlaying}
            fullscreen={isFullscreen}
          />
        )}
        {visualMode === 'particles' && (
          <PremiumParticleField isPlaying={isPlaying} />
        )}
      </div>

      {/* Overlay de contrôles — glass design */}
      <AnimatePresence>
        {(showControls || !isFullscreen) && (
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Top bar — mode switcher */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-1.5">
                  {visualModes.map((mode) => {
                    const Icon = mode.icon;
                    const active = visualMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setVisualMode(mode.id)}
                        className={cn(
                          'player-btn player-btn--sm',
                          active && 'player-btn--primary'
                        )}
                        aria-label={mode.label}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="player-btn player-btn--sm player-btn--primary"
                  aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Bottom bar — glass music player */}
            <div className="player-control-bar player-control-bar--glass">
              <div className="bg-black/10 backdrop-blur-2xl rounded-2xl border border-white/8 p-4 sm:p-6">
                <PremiumMusicPlayer
                  className="bg-transparent border-0 shadow-none"
                  compact={isFullscreen}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track info overlay — center, fades when controls hidden */}
      <AnimatePresence>
        {currentTrack && isFullscreen && !showControls && (
          <motion.div
            className="absolute bottom-8 left-8 z-5 pointer-events-none"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white/80 text-sm font-medium">{currentTrack.title}</p>
            <p className="text-white/40 text-xs">{currentTrack.artist}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ImmersiveFullscreenPlayer);
