/**
 * SilkOverlay - Overlay de pause écran avec blur progressif
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SilkOverlayProps {
  isActive: boolean;
  timeRemaining: number;
  totalDuration: number;
  phase: 'preparation' | 'active' | 'ending';
  enableBlur: boolean;
  onEscape?: () => void;
  className?: string;
}

export const SilkOverlay: React.FC<SilkOverlayProps> = ({
  isActive,
  timeRemaining,
  totalDuration,
  phase,
  enableBlur,
  onEscape,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(isActive);
  }, [isActive]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isActive) {
        event.preventDefault();
        onEscape?.();
      }
    };

    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isActive, onEscape]);

  const progress = totalDuration > 0 ? (totalDuration - timeRemaining) / totalDuration : 0;
  const blurIntensity = enableBlur ? Math.min(progress * 20, 15) : 0;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseMessage = () => {
    switch (phase) {
      case 'preparation':
        return 'Préparation de votre pause...';
      case 'active':
        return 'Détendez vos yeux';
      case 'ending':
        return 'Votre pause se termine';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'preparation':
        return 'text-blue-400';
      case 'active':
        return 'text-green-400';
      case 'ending':
        return 'text-orange-400';
      default:
        return 'text-white';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
            className
          )}
          style={{
            backdropFilter: enableBlur ? `blur(${blurIntensity}px)` : 'none',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Pause Screen Silk active"
        >
          {/* Animated background patterns */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 bg-white/5 rounded-full"
                animate={{
                  x: [0, 100, -50, 0],
                  y: [0, -100, 50, 0],
                  scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                  duration: 20 + i * 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2
                }}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 10}%`,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center space-y-8 p-8">
            {/* Timer principal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl font-mono font-light text-white drop-shadow-2xl"
                aria-live="polite"
                aria-label={`Temps restant: ${formatTime(timeRemaining)}`}
              >
                {formatTime(timeRemaining)}
              </motion.div>

              <motion.p
                className={cn("text-2xl font-medium", getPhaseColor())}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {getPhaseMessage()}
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-white/70 text-sm mt-2" aria-live="polite">
                {Math.round(progress * 100)}% terminé
              </p>
            </div>

            {/* Instructions subtiles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2 }}
              className="text-white/60 text-lg space-y-2"
            >
              <p>Regardez au loin, détendez vos épaules</p>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-sm"
              >
                Appuyez sur Échap pour interrompre
              </motion.p>
            </motion.div>
          </div>

          {/* Ambient light effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-transparent via-white/5 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ mixBlendMode: 'overlay' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SilkOverlay;