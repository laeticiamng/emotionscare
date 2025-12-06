/**
 * Lazy Motion Configuration
 *
 * Optimized Framer Motion setup using LazyMotion to reduce bundle size by ~100KB.
 *
 * Instead of importing the full framer-motion package (~300KB), we use LazyMotion
 * with domAnimation features (~200KB), saving ~100KB.
 *
 * Usage:
 * ```tsx
 * import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
 *
 * function MyComponent() {
 *   return (
 *     <LazyMotionWrapper>
 *       <m.div
 *         initial={{ opacity: 0 }}
 *         animate={{ opacity: 1 }}
 *       >
 *         Content
 *       </m.div>
 *     </LazyMotionWrapper>
 *   );
 * }
 * ```
 *
 * @see BUNDLE_SIZE_ANALYSIS_MUSIC.md for optimization details
 */

import React from 'react';
import { LazyMotion, domAnimation, m as motion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';

/**
 * Pre-configured LazyMotion wrapper
 *
 * Wrap your component tree once at the top level.
 * All child components can then use `m` instead of `motion`.
 */
export function LazyMotionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

/**
 * Optimized motion component
 *
 * Use this instead of `motion` from framer-motion:
 * - ✅ import { m } from '@/utils/lazy-motion';
 * - ❌ import { motion } from 'framer-motion';
 *
 * Supports all the same props as motion, but with smaller bundle size.
 */
export const m = motion;

/**
 * AnimatePresence component
 *
 * Re-exported for convenience. Use with LazyMotionWrapper.
 */
export const AnimatePresence = FramerAnimatePresence;

/**
 * Common animation variants for consistency
 */
export const animations = {
  /**
   * Fade in/out
   */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },

  /**
   * Slide up
   */
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },

  /**
   * Slide down
   */
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 }
  },

  /**
   * Scale
   */
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  },

  /**
   * Slide from left
   */
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },

  /**
   * Slide from right
   */
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },

  /**
   * Stagger children
   */
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

/**
 * Spring transition presets
 */
export const springs = {
  /**
   * Bouncy spring
   */
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20
  },

  /**
   * Smooth spring
   */
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25
  },

  /**
   * Gentle spring
   */
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20
  }
};

/**
 * Helper to create custom variants
 */
export function createVariants(
  initial: any,
  animate: any,
  exit?: any,
  transition?: any
) {
  return {
    initial,
    animate,
    ...(exit && { exit }),
    ...(transition && { transition })
  };
}

/**
 * Type exports
 */
export type { Variant, Variants, Transition } from 'framer-motion';
