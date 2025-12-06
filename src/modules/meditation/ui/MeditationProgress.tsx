/**
 * MeditationProgress - Barre de progression circulaire
 */

import { motion } from 'framer-motion';

interface MeditationProgressProps {
  progress: number;
}

export function MeditationProgress({ progress }: MeditationProgressProps) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="flex justify-center">
      <svg width="280" height="280" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}
