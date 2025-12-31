/**
 * BreathingBubble - Bulle de respiration animée avec compteur de cycles corrigé
 */

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';
import type { BreathingIntensity } from '@/modules/nyvee/types';

interface BreathingBubbleProps {
  isActive: boolean;
  intensity?: BreathingIntensity;
  targetCycles?: number;
  onCycleComplete?: () => void;
  className?: string;
}

const BUBBLE_CLASSES = {
  calm: 'from-emerald-400/40 via-cyan-400/30 to-blue-400/40',
  moderate: 'from-violet-400/40 via-purple-400/30 to-primary/40',
  intense: 'from-orange-400/40 via-rose-400/30 to-red-400/40',
} as const;

const CYCLE_CONFIGS = {
  calm: { inhale: 4000, hold: 2000, exhale: 6000 },
  moderate: { inhale: 4000, hold: 4000, exhale: 4000 },
  intense: { inhale: 4000, hold: 7000, exhale: 8000 },
} as const;

const PHASE_LABELS = {
  inhale: 'Inspire',
  hold: 'Retiens',
  exhale: 'Expire',
};

export const BreathingBubble = memo(({
  isActive,
  intensity = 'calm',
  targetCycles = 6,
  onCycleComplete,
  className,
}: BreathingBubbleProps) => {
  const bubbleControls = useAnimation();
  const particlesControls = useAnimation();
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const { pattern } = useHaptics();
  
  // Refs pour éviter les problèmes de closure
  const cycleCountRef = useRef(0);
  const isActiveRef = useRef(isActive);
  const phaseTimeoutRef = useRef<NodeJS.Timeout>();
  const isRunningRef = useRef(false);

  const cycleConfig = CYCLE_CONFIGS[intensity];

  // Sync ref avec state
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Reset quand isActive change
  useEffect(() => {
    if (!isActive) {
      cycleCountRef.current = 0;
      setCycleCount(0);
      setPhase('inhale');
      isRunningRef.current = false;
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      bubbleControls.stop();
      particlesControls.stop();
    }
  }, [isActive, bubbleControls, particlesControls]);

  const runCycle = useCallback(async () => {
    if (!isActiveRef.current || isRunningRef.current) return;
    if (cycleCountRef.current >= targetCycles) {
      onCycleComplete?.();
      return;
    }

    isRunningRef.current = true;

    try {
      // Inhale
      setPhase('inhale');
      await Promise.all([
        bubbleControls.start({
          scale: 1.5,
          opacity: 0.9,
          transition: { duration: cycleConfig.inhale / 1000, ease: 'easeInOut' },
        }),
        particlesControls.start({
          opacity: 1,
          scale: 1.2,
          transition: { duration: cycleConfig.inhale / 1000 },
        }),
      ]);

      if (!isActiveRef.current) return;

      // Hold
      setPhase('hold');
      await new Promise<void>((resolve) => {
        phaseTimeoutRef.current = setTimeout(resolve, cycleConfig.hold);
      });

      if (!isActiveRef.current) return;

      // Exhale
      setPhase('exhale');
      pattern([50, 100, 50]); // Haptic feedback

      await Promise.all([
        bubbleControls.start({
          scale: 1,
          opacity: 0.6,
          transition: { duration: cycleConfig.exhale / 1000, ease: 'easeInOut' },
        }),
        particlesControls.start({
          opacity: 0.3,
          scale: 0.8,
          transition: { duration: cycleConfig.exhale / 1000 },
        }),
      ]);

      if (!isActiveRef.current) return;

      // Increment cycle
      cycleCountRef.current += 1;
      setCycleCount(cycleCountRef.current);

      isRunningRef.current = false;

      // Check if complete
      if (cycleCountRef.current >= targetCycles) {
        onCycleComplete?.();
      } else {
        // Pause avant prochain cycle
        phaseTimeoutRef.current = setTimeout(() => {
          runCycle();
        }, 500);
      }
    } catch (error) {
      console.error('Breathing cycle error:', error);
      isRunningRef.current = false;
    }
  }, [bubbleControls, particlesControls, cycleConfig, targetCycles, onCycleComplete, pattern]);

  // Start cycle when active
  useEffect(() => {
    if (isActive && cycleCountRef.current === 0 && !isRunningRef.current) {
      runCycle();
    }

    return () => {
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    };
  }, [isActive, runCycle]);

  return (
    <div 
      className={cn('relative flex h-[400px] w-full items-center justify-center', className)}
      role="img"
      aria-label={`Bulle de respiration - ${PHASE_LABELS[phase]} - Cycle ${cycleCount + 1} sur ${targetCycles}`}
      aria-live="polite"
    >
      {/* Particles background */}
      <motion.div
        animate={particlesControls}
        className="absolute inset-0"
        initial={{ opacity: 0.3, scale: 0.8 }}
        aria-hidden="true"
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-foreground/20 blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Main breathing bubble */}
      <motion.div
        animate={bubbleControls}
        initial={{ scale: 1, opacity: 0.6 }}
        className={cn(
          'relative h-64 w-64 rounded-full backdrop-blur-xl',
          'bg-gradient-to-br',
          BUBBLE_CLASSES[intensity],
          'border border-border/20 shadow-2xl',
          'flex items-center justify-center'
        )}
        style={{
          boxShadow: '0 0 80px hsl(var(--primary) / 0.2), inset 0 0 60px hsl(var(--primary) / 0.1)',
        }}
      >
        {/* Inner glow */}
        <motion.div
          animate={{
            opacity: phase === 'hold' ? 0.8 : 0.4,
            scale: phase === 'hold' ? 1.1 : 1,
          }}
          transition={{ duration: 1 }}
          className="absolute inset-4 rounded-full bg-foreground/5 blur-2xl"
          aria-hidden="true"
        />

        {/* Phase indicator */}
        <div className="relative z-10 text-center">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl font-light text-foreground"
          >
            {PHASE_LABELS[phase]}
          </motion.p>
          <p className="mt-2 text-sm text-muted-foreground">
            Cycle {cycleCount + 1}/{targetCycles}
          </p>
        </div>
      </motion.div>

      {/* Ambient rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-border/10"
          style={{
            width: `${280 + i * 40}px`,
            height: `${280 + i * 40}px`,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

BreathingBubble.displayName = 'BreathingBubble';

export default BreathingBubble;
