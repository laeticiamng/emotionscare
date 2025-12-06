/**
 * MeditationTimer - Affichage du temps écoulé/restant
 */

import { motion } from 'framer-motion';

interface MeditationTimerProps {
  elapsedSeconds: number;
  totalSeconds: number;
}

export function MeditationTimer({ elapsedSeconds, totalSeconds }: MeditationTimerProps) {
  const remaining = Math.max(0, totalSeconds - elapsedSeconds);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl font-mono font-bold"
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </motion.div>
      <p className="text-sm text-muted-foreground mt-2">
        {Math.floor(elapsedSeconds / 60)}min / {Math.floor(totalSeconds / 60)}min
      </p>
    </div>
  );
}
