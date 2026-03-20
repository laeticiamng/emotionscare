/**
 * Experience Layer — PageTransition
 * AnimatePresence wrapper that applies configured transition per route.
 *
 * Transition types:
 *   fade-through:  Cross-fade with opacity
 *   depth-shift:   Z-axis shift (scale + opacity)
 *   ambient-morph:  Soft fade with background palette shift
 *   reveal:        Scale-up from center with blur clear
 *   cut:           Instant, no animation
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useExperienceStore } from '../store/experience.store';
import type { TransitionType } from '../types';

interface PageTransitionProps {
  children: React.ReactNode;
}

function getVariants(type: TransitionType, duration: number) {
  const baseDuration = duration / 1000;

  switch (type) {
    case 'fade-through':
      return {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { duration: baseDuration, ease: [0.16, 1, 0.3, 1] },
      };

    case 'depth-shift':
      return {
        initial: { opacity: 0, scale: 0.97, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 1.01, y: -6 },
        transition: { duration: baseDuration, ease: [0.16, 1, 0.3, 1] },
      };

    case 'ambient-morph':
      return {
        initial: { opacity: 0, filter: 'blur(4px)' },
        animate: { opacity: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, filter: 'blur(2px)' },
        transition: { duration: baseDuration, ease: 'easeInOut' },
      };

    case 'reveal':
      return {
        initial: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
        animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 1.02, filter: 'blur(4px)' },
        transition: { duration: baseDuration, ease: [0.16, 1, 0.3, 1] },
      };

    case 'cut':
    default:
      return {
        initial: {},
        animate: {},
        exit: {},
        transition: { duration: 0 },
      };
  }
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const transition = useExperienceStore((s) => s.currentTransition);
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);

  // Force cut for reduced motion
  const effectiveType = reducedMotion ? 'cut' : transition.type;
  const effectiveDuration = reducedMotion ? 0 : transition.duration;

  const variants = getVariants(effectiveType, effectiveDuration);

  if (effectiveType === 'cut') {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={variants.transition}
        style={{ willChange: 'opacity, transform, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
