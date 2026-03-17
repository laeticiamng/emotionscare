/**
 * AnimatedPage — Wraps page content with cinematic enter/exit transitions.
 * Uses centralized motion tokens for consistent rhythm across the app.
 *
 * Usage: Wrap any page content to get smooth fade-slide transitions
 * when navigating between routes.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className }) => (
  <motion.div
    initial={pageTransition.initial}
    animate={pageTransition.animate}
    exit={pageTransition.exit}
    className={className}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
