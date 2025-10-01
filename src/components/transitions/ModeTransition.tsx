// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { UserModeType } from '@/types/userMode';

interface ModeTransitionProps {
  children: React.ReactNode;
  mode: UserModeType;
  className?: string;
}

/**
 * A component that provides smooth transitions when switching between different user modes
 * It applies different animation styles based on the current mode
 */
const ModeTransition: React.FC<ModeTransitionProps> = ({ 
  children, 
  mode, 
  className = "" 
}) => {
  // Different animation variants for different user modes
  const getVariants = () => {
    switch(mode) {
      case 'b2b_admin':
        return {
          initial: { opacity: 0, y: 20, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -20, scale: 0.98 },
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        };
      case 'b2b_user':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        };
      case 'b2c':
      default:
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 },
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        };
    }
  };
  
  const variants = getVariants();
  
  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={variants.transition}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ModeTransition;
