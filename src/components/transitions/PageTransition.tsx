
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  location?: string;
  mode?: 'slide' | 'fade' | 'scale' | 'flip' | 'zoom';
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  location,
  mode = 'fade'
}) => {
  // Animation presets
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slide: {
      initial: { opacity: 0, x: 15 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -15 },
      transition: { type: 'spring', stiffness: 260, damping: 20, duration: 0.3 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.04 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    flip: {
      initial: { opacity: 0, rotateX: -10 },
      animate: { opacity: 1, rotateX: 0 },
      exit: { opacity: 0, rotateX: 10 },
      transition: { type: 'spring', stiffness: 260, damping: 20 }
    },
    zoom: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };
  
  const selectedAnimation = animations[mode];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location || 'default'}
        initial={selectedAnimation.initial}
        animate={selectedAnimation.animate}
        exit={selectedAnimation.exit}
        transition={selectedAnimation.transition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export { PageTransition };
export default PageTransition;
