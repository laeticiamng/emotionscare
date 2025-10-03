import { useCallback, useMemo, useRef } from 'react';
import { Variants } from 'framer-motion';

export interface OptimizedAnimationConfig {
  enableComplexAnimations?: boolean;
  particleCount?: number;
  animationDuration?: number;
  useCSSAnimations?: boolean;
}

export const useOptimizedAnimation = (config: OptimizedAnimationConfig = {}) => {
  const {
    enableComplexAnimations = true,
    particleCount = 8,
    animationDuration = 1,
    useCSSAnimations = false
  } = config;

  const animationRef = useRef<number | null>(null);

  // Performance-optimized entrance animation
  const entranceVariants: Variants = useMemo(() => ({
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: animationDuration,
        ease: "easeOut",
      }
    }
  }), [animationDuration]);

  // Optimized floating animation
  const floatingVariants: Variants = useMemo(() => ({
    animate: enableComplexAnimations ? {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    } : {}
  }), [enableComplexAnimations]);

  // Breathing animation (for orbs/spheres)
  const breathingVariants: Variants = useMemo(() => ({
    inhale: {
      scale: 1.2,
      transition: { duration: 4, ease: "easeInOut" }
    },
    hold: {
      scale: 1.1,
      transition: { duration: 2, ease: "easeInOut" }
    },
    exhale: {
      scale: 1,
      transition: { duration: 6, ease: "easeInOut" }
    }
  }), []);

  // Generate optimized particle positions
  const generateParticles = useCallback((count: number = particleCount) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 360 / count) % 100,
      y: ((i * 7) + (i * 11)) % 100,
      delay: i * 0.1,
      duration: 2 + (i % 3),
    }));
  }, [particleCount]);

  // CSS-based animation classes for better performance
  const cssAnimationClasses = useMemo(() => ({
    pulse: useCSSAnimations ? 'animate-pulse' : '',
    spin: useCSSAnimations ? 'animate-spin' : '',
    bounce: useCSSAnimations ? 'animate-bounce' : '',
    ping: useCSSAnimations ? 'animate-ping' : '',
    fadeIn: 'animate-fade-in',
    scaleIn: 'animate-scale-in',
  }), [useCSSAnimations]);

  // Cleanup function for performance
  const cleanupAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Optimized spring config
  const springConfig = useMemo(() => ({
    type: "spring",
    stiffness: 100,
    damping: 15,
    mass: 1,
  }), []);

  return {
    entranceVariants,
    floatingVariants,
    breathingVariants,
    generateParticles,
    cssAnimationClasses,
    cleanupAnimation,
    springConfig,
    isOptimized: true,
  };
};