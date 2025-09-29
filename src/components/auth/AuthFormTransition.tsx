
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuthFormTransitionProps {
  children: React.ReactNode;
  show?: boolean;
  className?: string;
}

const AuthFormTransition: React.FC<AuthFormTransitionProps> = ({
  children,
  show = true,
  className
}) => {
  return (
    <AnimatePresence mode="sync">{/* Fixed multiple children warning */}
      {show && (
        <motion.div
          className={cn("w-full", className)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1] 
            }
          }}
          exit={{ 
            opacity: 0, 
            y: -20,
            transition: { 
              duration: 0.3, 
              ease: [0.22, 1, 0.36, 1] 
            }
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthFormTransition;
