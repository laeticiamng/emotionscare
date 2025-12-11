import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BreathProgressProps {
  stepLabel: string;
  stepProgress: number;
  sessionProgress: number;
  totalDuration?: number;
  elapsedTime?: number;
  cyclesCompleted?: number;
  totalCycles?: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getMotivationalMessage = (progress: number): string => {
  if (progress < 0.25) return 'Belle énergie pour débuter ! 🌱';
  if (progress < 0.5) return 'Tu es sur la bonne voie ! 💫';
  if (progress < 0.75) return 'Plus de la moitié accomplie ! 🌟';
  if (progress < 0.95) return 'La fin approche, courage ! 🎯';
  return 'Bravo, session terminée ! 🏆';
};

export function BreathProgress({ 
  stepLabel, 
  stepProgress, 
  sessionProgress,
  totalDuration = 0,
  elapsedTime = 0,
  cyclesCompleted = 0,
  totalCycles = 0,
}: BreathProgressProps) {
  const stepWidth = `${Math.round(clamp(stepProgress) * 100)}%`;
  const sessionWidth = `${Math.round(clamp(sessionProgress) * 100)}%`;
  const remainingTime = Math.max(0, totalDuration - elapsedTime);
  
  const motivationalMessage = useMemo(() => 
    getMotivationalMessage(sessionProgress), 
    [sessionProgress]
  );

  return (
    <div className="w-full space-y-4" role="region" aria-label="Progression de la respiration">
      {/* Phase actuelle avec animation */}
      <motion.div 
        className="rounded-lg border border-sky-100 bg-sky-50/70 dark:bg-sky-950/30 dark:border-sky-800 p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        key={stepLabel}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-sky-900 dark:text-sky-100">{stepLabel}</p>
          <span className="text-xs text-sky-700 dark:text-sky-300">
            {Math.round(clamp(stepProgress) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-sky-100 dark:bg-sky-900 overflow-hidden">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-500"
            initial={{ width: 0 }}
            animate={{ width: stepWidth }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Session globale */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Session globale</p>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {Math.round(clamp(sessionProgress) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-slate-500 to-slate-600 dark:from-slate-400 dark:to-slate-500"
            animate={{ width: sessionWidth }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Statistiques de session */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
          {totalDuration > 0 && (
            <>
              <span>⏱️ {formatTime(elapsedTime)} / {formatTime(totalDuration)}</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Reste: {formatTime(remainingTime)}
              </span>
            </>
          )}
          {totalCycles > 0 && (
            <span>🔄 Cycle {cyclesCompleted}/{totalCycles}</span>
          )}
        </div>
      </div>

      {/* Message motivationnel */}
      <motion.div 
        className="text-center text-sm text-slate-600 dark:text-slate-400"
        key={motivationalMessage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {motivationalMessage}
      </motion.div>
    </div>
  );
}
