// @ts-nocheck

import { useState, useEffect } from 'react';

export const useMotionPrefs = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Vérifier la préférence système
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Écouter les changements
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    prefersReducedMotion,
    // Helper pour conditionner les animations
    shouldAnimate: !prefersReducedMotion,
    // Durées adaptées
    getDuration: (defaultDuration: number) => 
      prefersReducedMotion ? 0.01 : defaultDuration,
    // Delays adaptés  
    getDelay: (defaultDelay: number) => 
      prefersReducedMotion ? 0 : defaultDelay
  };
};
