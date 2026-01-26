/**
 * Breathing AR Guide - Phase 4.5
 * Immersive breathing guidance with 3D sphere animations
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Wind, X, Play, Pause } from 'lucide-react';
import { useAR } from '@/contexts/ARContext';
import { useARBreathing } from '@/hooks/useARCore';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

export interface BreathingARGuideProps {
  userId: string | undefined;
  patternType?: '4-4-4' | '4-7-8' | 'box' | 'coherent';
  totalCycles?: number;
  onClose?: () => void;
  onComplete?: () => void;
  className?: string;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export function BreathingARGuide({
  userId,
  patternType = '4-4-4',
  totalCycles = 10,
  onClose,
  onComplete,
  className
}: BreathingARGuideProps) {
 const { breathingPattern, setBreathingPattern } = useAR();
 const { startBreathingSession, getBreathingPattern } =
    useARBreathing(userId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sphereSize, setSphereSize] = useState(1);

  // Initialize breathing session
  useEffect(() => {
    const initSession = async () => {
      if (isStarted && userId) {
        const sessionId = await startBreathingSession(patternType, totalCycles);
        if (sessionId) {
          const pattern = getBreathingPattern(patternType);
          setBreathingPattern(pattern);
          logger.info('Breathing session started', { pattern: patternType }, 'AR');
        }
      }
    };

    if (isStarted) {
      initSession();
    }
  }, [isStarted, userId, patternType, totalCycles, startBreathingSession, getBreathingPattern, setBreathingPattern]);

  // Update sphere size based on breathing phase
  useEffect(() => {
    if (!breathingPattern || !isStarted) return;

    const cycleDuration =
      breathingPattern.inhaleSeconds +
      breathingPattern.holdSeconds +
      breathingPattern.exhaleSeconds +
      breathingPattern.pauseSeconds;

    const updatePhase = () => {
      timeRef.current += 0.016; // ~60fps
      const cycleTime = timeRef.current % cycleDuration;
      let newPhase: BreathPhase = 'inhale';
      let newProgress = 0;
      let newSize = 1;

      // Inhale phase
      if (cycleTime < breathingPattern.inhaleSeconds) {
        newPhase = 'inhale';
        newProgress = cycleTime / breathingPattern.inhaleSeconds;
        newSize = 1 + newProgress * 0.5; // Expand to 1.5x
      }
      // Hold phase
      else if (cycleTime < breathingPattern.inhaleSeconds + breathingPattern.holdSeconds) {
        newPhase = 'hold';
        newProgress = (cycleTime - breathingPattern.inhaleSeconds) / breathingPattern.holdSeconds;
        newSize = 1.5;
      }
      // Exhale phase
      else if (
        cycleTime <
        breathingPattern.inhaleSeconds +
          breathingPattern.holdSeconds +
          breathingPattern.exhaleSeconds
      ) {
        newPhase = 'exhale';
        const exhaleStart =
          breathingPattern.inhaleSeconds + breathingPattern.holdSeconds;
        newProgress = (cycleTime - exhaleStart) / breathingPattern.exhaleSeconds;
        newSize = 1.5 - newProgress * 0.5; // Shrink to 1x
      }
      // Pause phase
      else {
        newPhase = 'pause';
        const pauseStart =
          breathingPattern.inhaleSeconds +
          breathingPattern.holdSeconds +
          breathingPattern.exhaleSeconds;
        newProgress = (cycleTime - pauseStart) / (breathingPattern.pauseSeconds || 0.1);
        newSize = 1;
      }

      setCurrentPhase(newPhase);
      setPhaseProgress(newProgress);
      setSphereSize(newSize);

      // Check if cycle completed
      if (cycleTime < 0.016 && timeRef.current > cycleDuration) {
        const newCycles = cyclesCompleted + 1;
        setCyclesCompleted(newCycles);

        if (newCycles >= totalCycles) {
          setIsStarted(false);
          onComplete?.();
        }
      }
    };

    updatePhase();
  }, [breathingPattern, isStarted, cyclesCompleted, totalCycles, onComplete]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    const animate = () => {
      // Clear with fade
      ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isStarted && !isPaused) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = Math.min(canvas.width, canvas.height) * 0.15;

        // Draw breathing sphere
        const gradient = ctx.createRadialGradient(
          centerX - baseRadius * 0.3,
          centerY - baseRadius * 0.3,
          0,
          centerX,
          centerY,
          baseRadius * sphereSize
        );

        const phaseColors: Record<BreathPhase, string> = {
          inhale: '#4F46E5', // Indigo
          hold: '#7C3AED', // Purple
          exhale: '#EC4899', // Pink
          pause: '#6B7280' // Gray
        };

        gradient.addColorStop(0, phaseColors[currentPhase] + '80');
        gradient.addColorStop(0.7, phaseColors[currentPhase] + '40');
        gradient.addColorStop(1, phaseColors[currentPhase] + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * sphereSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw inner circle
        ctx.fillStyle = phaseColors[currentPhase];
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * sphereSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw breathing text indicator
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(
          {
            inhale: 'Inspirez',
            hold: 'Retenez',
            exhale: 'Expirez',
            pause: 'Pause'
          }[currentPhase],
          centerX,
          centerY + baseRadius * sphereSize + 50
        );

        // Draw progress bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(centerX - 100, centerY + baseRadius * sphereSize + 80, 200, 4);

        ctx.fillStyle = phaseColors[currentPhase];
        ctx.fillRect(centerX - 100, centerY + baseRadius * sphereSize + 80, 200 * phaseProgress, 4);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isStarted, isPaused, currentPhase, phaseProgress, sphereSize]);

  const handleToggleBreathing = useCallback(() => {
    if (!isStarted) {
      setIsStarted(true);
      timeRef.current = 0;
    } else {
      setIsPaused(!isPaused);
    }
  }, [isStarted, isPaused]);

  const phaseLabels: Record<BreathPhase, string> = {
    inhale: 'Inspiration',
    hold: 'Rétention',
    exhale: 'Expiration',
    pause: 'Pause'
  };

  return (
    <div className={cn('relative w-full h-full overflow-hidden bg-gradient-to-b from-gray-900 to-black', className)}>
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <Wind className="w-6 h-6" />
            <h2 className="text-xl font-bold">Respiration Guidée</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="pointer-events-auto p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Main content */}
        {!isStarted ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-2">Prêt à respirer?</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Cet exercice vous guidera à travers {totalCycles} cycles de respiration avec le pattern
                {' '}
                <strong>{patternType}</strong>
              </p>
              <button
                onClick={handleToggleBreathing}
                className="pointer-events-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-lg transition-all flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                Commencer
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-between py-8">
            {/* Phase info */}
            <div className="text-center text-white">
              <div className="text-lg font-semibold mb-2">
                Phase: <span className="text-indigo-400 capitalize">{phaseLabels[currentPhase]}</span>
              </div>
              <div className="text-3xl font-bold">
                {Math.ceil((1 - phaseProgress) * (
                  currentPhase === 'inhale'
                    ? breathingPattern?.inhaleSeconds || 4
                    : currentPhase === 'hold'
                      ? breathingPattern?.holdSeconds || 4
                      : currentPhase === 'exhale'
                        ? breathingPattern?.exhaleSeconds || 4
                        : breathingPattern?.pauseSeconds || 0
                ))}s
              </div>
            </div>

            {/* Progress */}
            <div className="text-center text-white">
              <div className="text-2xl font-bold">
                {cyclesCompleted}/{totalCycles}
              </div>
              <p className="text-gray-300">Cycles complétés</p>
            </div>

            {/* Controls */}
            <button
              onClick={handleToggleBreathing}
              className="pointer-events-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all flex items-center gap-2"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Reprendre' : 'Pause'}
            </button>
          </div>
        )}

        {/* Bottom stats */}
        <div className="p-6">
          <div className="bg-black bg-opacity-60 rounded-lg p-4 max-w-sm mx-auto">
            <h4 className="text-white font-semibold mb-2">Pattern: {patternType}</h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {breathingPattern && (
                <>
                  <div className="text-gray-300">
                    <div className="font-bold text-indigo-400">{breathingPattern.inhaleSeconds}s</div>
                    <div>Inspir</div>
                  </div>
                  <div className="text-gray-300">
                    <div className="font-bold text-purple-400">{breathingPattern.holdSeconds}s</div>
                    <div>Reten</div>
                  </div>
                  <div className="text-gray-300">
                    <div className="font-bold text-pink-400">{breathingPattern.exhaleSeconds}s</div>
                    <div>Expir</div>
                  </div>
                  {breathingPattern.pauseSeconds > 0 && (
                    <div className="text-gray-300">
                      <div className="font-bold text-gray-400">{breathingPattern.pauseSeconds}s</div>
                      <div>Pause</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
