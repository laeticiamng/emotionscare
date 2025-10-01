// @ts-nocheck
/**
 * VelvetPulse - Animation de pulse velours pour Flash Glow
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VelvetPulseProps {
  isActive: boolean;
  intensity: number;
  glowType: string;
  duration: number;
  onComplete?: () => void;
  className?: string;
}

const glowColors = {
  energy: 'from-yellow-400 via-orange-500 to-red-500',
  calm: 'from-blue-400 via-cyan-500 to-teal-400',
  creativity: 'from-purple-400 via-pink-500 to-indigo-500',
  confidence: 'from-amber-400 via-yellow-500 to-orange-400',
  love: 'from-pink-400 via-rose-500 to-red-400'
};

const VelvetPulse: React.FC<VelvetPulseProps> = ({
  isActive,
  intensity,
  glowType,
  duration,
  onComplete,
  className
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'warm-up' | 'peak' | 'cool-down'>('warm-up');

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setCurrentPhase('warm-up');
      return;
    }

    const startTime = Date.now();
    const durationMs = duration * 1000;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / durationMs, 1);
      
      setProgress(currentProgress);

      // Phases de l'animation
      if (currentProgress < 0.2) {
        setCurrentPhase('warm-up');
      } else if (currentProgress < 0.8) {
        setCurrentPhase('peak');
      } else {
        setCurrentPhase('cool-down');
      }

      if (currentProgress >= 1) {
        onComplete?.();
      } else {
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
  }, [isActive, duration, onComplete]);

  const getPhaseIntensity = () => {
    switch (currentPhase) {
      case 'warm-up':
        return intensity * 0.3 + (progress * 0.7 * intensity);
      case 'peak':
        return intensity;
      case 'cool-down':
        return intensity * (1 - progress);
      default:
        return intensity;
    }
  };

  const currentIntensity = getPhaseIntensity();
  const colorGradient = glowColors[glowType as keyof typeof glowColors] || glowColors.energy;

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <AnimatePresence>
        {isActive && (
          <>
            {/* Pulse principal velours */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.8, 0.8, 0.4],
                scale: [0.5, 1.2, 1.5, 2.0],
                filter: `blur(${Math.max(0, 20 - currentIntensity * 0.2)}px)`
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: duration,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1]
              }}
              className={cn(
                "absolute inset-0 bg-gradient-to-r",
                colorGradient
              )}
              style={{
                opacity: currentIntensity / 100,
                mixBlendMode: 'screen'
              }}
            />

            {/* Ondulations velours */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 0.4, 0.2, 0],
                  scale: [0.3, 0.8, 1.3, 1.8],
                }}
                transition={{
                  duration: duration,
                  delay: i * 0.3,
                  ease: "easeOut",
                  repeat: Math.floor(duration / 2),
                  repeatType: "loop"
                }}
                className={cn(
                  "absolute inset-0 bg-gradient-radial",
                  colorGradient
                )}
                style={{
                  opacity: (currentIntensity / 100) * 0.3,
                  mixBlendMode: 'overlay'
                }}
              />
            ))}

            {/* Particules flottantes */}
            {intensity > 60 && [...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{
                  opacity: 0,
                  x: '50%',
                  y: '50%'
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  x: `${50 + (Math.sin(i * 45) * 40)}%`,
                  y: `${50 + (Math.cos(i * 45) * 40)}%`,
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * duration,
                  repeat: Math.floor(duration / 3),
                  repeatType: "loop"
                }}
                className="absolute w-3 h-3 rounded-full bg-white/60 backdrop-blur-sm"
              />
            ))}

            {/* Effet de bordure douce */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.3, 0] }}
              transition={{ duration: duration, ease: "easeInOut" }}
              className="absolute inset-0 border-2 border-white/20 rounded-lg backdrop-blur-sm"
            />
          </>
        )}
      </AnimatePresence>

      {/* Overlay de progression */}
      {isActive && (
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            className="h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
          >
            <motion.div
              className="h-full bg-white/60 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>
          <div className="text-white/80 text-sm text-center mt-2 font-medium">
            {currentPhase === 'warm-up' && 'Échauffement...'}
            {currentPhase === 'peak' && 'Intensité maximale ✨'}
            {currentPhase === 'cool-down' && 'Apaisement...'}
          </div>
        </div>
      )}

      {/* État de repos */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-center text-muted-foreground"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-muted-foreground/20 rounded-full" />
            </div>
            <p className="text-sm">Prêt pour le Flash Glow</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VelvetPulse;