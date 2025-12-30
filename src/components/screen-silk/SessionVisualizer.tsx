/**
 * Session Visualizer - Animation visuelle de la session
 */

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SilkPattern, SilkTheme } from './types';

interface SessionVisualizerProps {
  pattern: SilkPattern;
  theme: SilkTheme;
  timeRemaining: number;
  blinkCount: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const SessionVisualizer = memo(function SessionVisualizer({
  pattern,
  theme,
  timeRemaining,
  blinkCount,
  isPaused,
  onPause,
  onResume,
  onStop
}: SessionVisualizerProps) {
  const progress = useMemo(() => {
    return ((pattern.duration - timeRemaining) / pattern.duration) * 100;
  }, [pattern.duration, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Blink animation trigger
  const shouldBlink = blinkCount > 0 && blinkCount % 1 === 0;

  return (
    <div
      className="relative w-full h-[60vh] min-h-[400px] rounded-2xl overflow-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${theme.colors.primary}40 0%, transparent 50%)`,
            `radial-gradient(circle at 70% 70%, ${theme.colors.secondary}40 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 70%, ${theme.colors.primary}40 0%, transparent 50%)`,
            `radial-gradient(circle at 70% 30%, ${theme.colors.secondary}40 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 30%, ${theme.colors.primary}40 0%, transparent 50%)`
          ]
        }}
        transition={{
          duration: pattern.intensity === 'low' ? 8 : pattern.intensity === 'medium' ? 5 : 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Central breathing circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="rounded-full"
          style={{
            background: `radial-gradient(circle, ${theme.colors.primary}80, ${theme.colors.secondary}40, transparent)`,
            boxShadow: `0 0 60px ${theme.colors.primary}60`
          }}
          animate={{
            width: isPaused ? [200, 200] : [150, 250, 150],
            height: isPaused ? [200, 200] : [150, 250, 150],
            opacity: isPaused ? 0.5 : [0.6, 0.9, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Blink guide overlay */}
      <AnimatePresence>
        {shouldBlink && !isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <Eye className="w-12 h-12 text-white/80" />
              <span className="text-white/80 text-lg font-medium">Clignez</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer and controls overlay */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        {/* Progress bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: theme.colors.primary }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex items-center justify-between">
          {/* Time remaining */}
          <div className="text-white">
            <div className="text-3xl font-bold font-mono">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-white/70">
              {blinkCount} clignements
            </div>
          </div>

          {/* Pattern info */}
          <div className="text-center text-white/80">
            <div className="text-2xl">{pattern.icon}</div>
            <div className="text-sm">{pattern.name}</div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={isPaused ? onResume : onPause}
              className="text-white hover:bg-white/20"
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onStop}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <div className="text-center text-white">
              <Pause className="w-16 h-16 mx-auto mb-4 opacity-80" />
              <p className="text-xl font-medium">En pause</p>
              <p className="text-sm text-white/70 mt-2">
                Appuyez sur lecture pour reprendre
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default SessionVisualizer;
