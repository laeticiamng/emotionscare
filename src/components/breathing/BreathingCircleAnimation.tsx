/**
 * BreathingCircleAnimation - Animation du cercle de respiration
 * Grandit/rétrécit selon la phase de respiration
 */

import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BreathingCircleAnimationProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'holdOut' | 'idle';
  phaseDuration: number; // en secondes
  instruction: string;
  timer: number; // temps restant de la phase
  gradientClass?: string;
  isActive: boolean;
}

export const BreathingCircleAnimation: React.FC<BreathingCircleAnimationProps> = ({
  phase,
  phaseDuration,
  instruction,
  timer,
  gradientClass = 'from-primary to-accent',
  isActive,
}) => {
  const controls = useAnimationControls();
  
  // Animation selon la phase
  useEffect(() => {
    if (!isActive) {
      controls.start({ scale: 1, opacity: 0.6 });
      return;
    }

    switch (phase) {
      case 'inhale':
        controls.start({
          scale: 1.5,
          opacity: 1,
          transition: { duration: phaseDuration, ease: 'easeInOut' },
        });
        break;
      case 'hold':
        controls.start({
          scale: 1.5,
          opacity: 1,
          transition: { duration: 0.2 },
        });
        break;
      case 'exhale':
        controls.start({
          scale: 1,
          opacity: 0.7,
          transition: { duration: phaseDuration, ease: 'easeInOut' },
        });
        break;
      case 'holdOut':
        controls.start({
          scale: 1,
          opacity: 0.6,
          transition: { duration: 0.2 },
        });
        break;
      default:
        controls.start({ scale: 1, opacity: 0.6 });
    }
  }, [phase, phaseDuration, isActive, controls]);

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'holdOut': return 'Pause';
      default: return 'Prêt';
    }
  };

  return (
    <div className="relative flex items-center justify-center h-72 w-72 mx-auto">
      {/* Cercle externe (aura) */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-br opacity-20 blur-xl',
          gradientClass
        )}
        animate={controls}
      />

      {/* Cercle principal animé */}
      <motion.div
        className={cn(
          'relative w-48 h-48 rounded-full bg-gradient-to-br flex items-center justify-center',
          gradientClass
        )}
        animate={controls}
      >
        {/* Contenu central */}
        <div className="text-center text-white z-10">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold mb-1"
          >
            {getPhaseLabel()}
          </motion.p>
          {isActive && (
            <motion.span
              key={timer}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold"
            >
              {timer}
            </motion.span>
          )}
        </div>

        {/* Cercle de progression */}
        {isActive && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={289}
              initial={{ strokeDashoffset: 289 }}
              animate={{
                strokeDashoffset: 289 - (289 * ((phaseDuration - timer) / phaseDuration)),
              }}
              transition={{ duration: 0.3 }}
            />
          </svg>
        )}
      </motion.div>

      {/* Instruction textuelle */}
      <motion.p
        key={instruction}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-0 text-center text-muted-foreground text-sm px-4"
      >
        {instruction}
      </motion.p>
    </div>
  );
};

export default BreathingCircleAnimation;
