// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/useHaptics';

interface BreathingBubbleProps {
  isActive: boolean;
  intensity?: 'calm' | 'moderate' | 'intense';
  onCycleComplete?: () => void;
  className?: string;
}

const BUBBLE_COLORS = {
  calm: 'from-emerald-400/40 via-cyan-400/30 to-blue-400/40',
  moderate: 'from-violet-400/40 via-purple-400/30 to-indigo-400/40',
  intense: 'from-orange-400/40 via-rose-400/30 to-red-400/40',
} as const;

const CYCLE_CONFIG = {
  inhale: 4000,
  hold: 2000,
  exhale: 6000,
};

export const BreathingBubble = ({
  isActive,
  intensity = 'calm',
  onCycleComplete,
  className,
}: BreathingBubbleProps) => {
  const bubbleControls = useAnimation();
  const particlesControls = useAnimation();
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const { pattern } = useHaptics();
  const phaseTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isActive) {
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      return;
    }

    const runCycle = async () => {
      // Inhale
      setPhase('inhale');
      await Promise.all([
        bubbleControls.start({
          scale: 1.5,
          opacity: 0.9,
          transition: { duration: CYCLE_CONFIG.inhale / 1000, ease: 'easeInOut' },
        }),
        particlesControls.start({
          opacity: 1,
          scale: 1.2,
          transition: { duration: CYCLE_CONFIG.inhale / 1000 },
        }),
      ]);

      // Hold
      setPhase('hold');
      phaseTimeoutRef.current = setTimeout(async () => {
        // Exhale
        setPhase('exhale');
        pattern([50, 100, 50]); // Haptic feedback sur l'expire

        await Promise.all([
          bubbleControls.start({
            scale: 1,
            opacity: 0.6,
            transition: { duration: CYCLE_CONFIG.exhale / 1000, ease: 'easeInOut' },
          }),
          particlesControls.start({
            opacity: 0.3,
            scale: 0.8,
            transition: { duration: CYCLE_CONFIG.exhale / 1000 },
          }),
        ]);

        setCycleCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 6) {
            onCycleComplete?.();
          }
          return newCount;
        });

        // Restart cycle
        if (cycleCount < 5) {
          phaseTimeoutRef.current = setTimeout(runCycle, 500);
        }
      }, CYCLE_CONFIG.hold);
    };

    runCycle();

    return () => {
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    };
  }, [isActive, bubbleControls, particlesControls, cycleCount, onCycleComplete, pattern]);

  return (
    <div className={cn('relative flex h-[400px] w-full items-center justify-center', className)}>
      {/* Particles background */}
      <motion.div
        animate={particlesControls}
        className="absolute inset-0"
        initial={{ opacity: 0.3, scale: 0.8 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/30 blur-sm"
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
          BUBBLE_COLORS[intensity],
          'border border-white/20 shadow-2xl',
          'flex items-center justify-center'
        )}
        style={{
          boxShadow: '0 0 80px rgba(147, 197, 253, 0.3), inset 0 0 60px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Inner glow */}
        <motion.div
          animate={{
            opacity: phase === 'hold' ? 0.8 : 0.4,
            scale: phase === 'hold' ? 1.1 : 1,
          }}
          transition={{ duration: 1 }}
          className="absolute inset-4 rounded-full bg-white/10 blur-2xl"
        />

        {/* Phase indicator */}
        <div className="relative z-10 text-center">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-2xl font-light text-foreground/90"
          >
            {phase === 'inhale' && 'Inspire'}
            {phase === 'hold' && 'Retiens'}
            {phase === 'exhale' && 'Expire'}
          </motion.p>
          <p className="mt-2 text-sm text-foreground/60">Cycle {cycleCount + 1}/6</p>
        </div>
      </motion.div>

      {/* Ambient rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/10"
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
        />
      ))}
    </div>
  );
};

export default BreathingBubble;
