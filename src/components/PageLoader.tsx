
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  isLoading?: boolean;
  duration?: number;
  onComplete?: () => void;
  variant?: 'default' | 'minimal';
}

const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading = false,
  duration = 1000,
  onComplete,
  variant = 'default'
}) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  
  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    }
    
    const timer = setTimeout(() => {
      setShowLoader(false);
      if (onComplete) {
        onComplete();
      }
    }, duration);
    
    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, duration, onComplete]);
  
  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {variant === 'default' ? (
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"
                />
              </div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-4 text-lg text-primary"
              >
                Chargement...
              </motion.p>
            </div>
          ) : (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
