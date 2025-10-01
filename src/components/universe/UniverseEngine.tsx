// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Universe } from '@/types/universes';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { useRewardsStore } from '@/store/rewards.store';

interface UniverseEngineProps {
  universe: Universe;
  isEntering: boolean;
  onEnterComplete: () => void;
  onExitComplete?: () => void;
  children: React.ReactNode;
  className?: string;
  enableParticles?: boolean;
  enableAmbianceSound?: boolean;
  particleDensity?: 'standard' | 'soft' | 'minimal';
}

export const UniverseEngine: React.FC<UniverseEngineProps> = ({
  universe,
  isEntering,
  onEnterComplete,
  onExitComplete,
  children,
  className = "",
  enableParticles = true,
  enableAmbianceSound = false,
  particleDensity = 'standard',
}) => {
  const [phase, setPhase] = useState<'entering' | 'active' | 'exiting'>('entering');
  const [isReady, setIsReady] = useState(false);

  const motionPreferences = useReducedMotion();

  const effectiveDensity = motionPreferences ? 'minimal' : particleDensity;
  const particleCount = useMemo(() => {
    switch (effectiveDensity) {
      case 'soft':
        return 3;
      case 'minimal':
        return 0;
      default:
        return 6;
    }
  }, [effectiveDensity]);

  const {
    entranceVariants,
    generateParticles,
    cssAnimationClasses,
    cleanupAnimation
  } = useOptimizedAnimation({
    enableComplexAnimations: !motionPreferences && effectiveDensity !== 'minimal',
    particleCount,
    useCSSAnimations: true,
  });

  // Optimized particles with reduced count
  const particles = useMemo(() => {
    if (!enableParticles || effectiveDensity === 'minimal') return [];
    return generateParticles(particleCount);
  }, [enableParticles, effectiveDensity, generateParticles, particleCount]);

  // Handle universe entrance
  useEffect(() => {
    if (isEntering) {
      setPhase('entering');
      const timer = setTimeout(() => {
        setPhase('active');
        setIsReady(true);
        onEnterComplete();
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [isEntering, onEnterComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAnimation();
    };
  }, [cleanupAnimation]);

  const universeStyle = useMemo(() => ({
    background: universe.ambiance.colors.background,
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [universe.ambiance.colors.background]);

  const getPhaseOpacity = useCallback(() => {
    switch (phase) {
      case 'entering': return 0.3;
      case 'active': return 1;
      case 'exiting': return 0.2;
      default: return 0;
    }
  }, [phase]);

  return (
    <div 
      className={`min-h-screen relative overflow-hidden ${className}`}
      style={universeStyle}
    >
      {/* Optimized ambient particles */}
      {enableParticles && effectiveDensity !== 'minimal' && isReady && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute w-1 h-1 rounded-full bg-white/60 ${cssAnimationClasses.pulse}`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Universe title during entrance */}
      <AnimatePresence>
        {phase === 'entering' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            variants={entranceVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="text-center">
              <motion.h1 
                className="text-4xl font-light text-white mb-4 tracking-wide"
                style={{ color: universe.ambiance.colors.primary }}
              >
                {universe.name}
              </motion.h1>
              <motion.p 
                className="text-lg text-white/70 max-w-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {universe.ambiance.metaphor}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div 
        className="relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.5, delay: isReady ? 0.8 : 0 }}
      >
        {children}
      </motion.div>

      {/* Ambient glow - CSS only for performance */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${universe.ambiance.colors.primary}15, transparent 70%)`
        }}
      />
    </div>
  );
};