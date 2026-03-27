// @ts-nocheck
/**
 * AnimatedPage — Wraps page content with experience-aware transitions.
 * Syncs route with experience store and renders ambient background.
 *
 * Uses the Experience Layer's PageTransition for route-aware transitions
 * and AmbientBackground for mood-reactive backgrounds.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';
import { useRouteExperience } from '@/experience/hooks/useRouteExperience';
import { AmbientBackground } from '@/experience/components/AmbientBackground';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className }) => {
  // Sync current route with experience store (immersion level, transitions)
  useRouteExperience();

  return (
    <>
      <AmbientBackground />
      <motion.div
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        className={className}
      >
        {children}
      </motion.div>
    </>
  );
};

export default AnimatedPage;
