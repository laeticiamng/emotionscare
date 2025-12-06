
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FadeTransitionProps {
  children: React.ReactNode;
  show: boolean;
  delay?: number;
  duration?: number;
}

const FadeTransition: React.FC<FadeTransitionProps> = ({ 
  children, 
  show, 
  delay = 0,
  duration = 0.3
}) => {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, delay }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FadeTransition;
