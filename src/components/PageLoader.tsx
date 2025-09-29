
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface PageLoaderProps {
  isLoading?: boolean;
  duration?: number;
  onComplete?: () => void;
  variant?: 'default' | 'minimal' | 'premium';
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  isLoading = false,
  duration = 1000,
  onComplete,
  variant = 'default',
  message = 'Chargement...'
}) => {
  const [showLoader, setShowLoader] = useState(isLoading);
  const { user } = useAuth();
  
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
  
  const renderLoader = () => {
    switch (variant) {
      case 'premium':
        return (
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2">
                {user ? `Bienvenue, ${user.name}` : 'Bienvenue'}
              </h3>
              <p className="text-muted-foreground">{message}</p>
            </motion.div>
          </div>
        );
      
      case 'minimal':
        return (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"
          />
        );
      
      default:
        return (
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
              {message}
            </motion.p>
          </div>
        );
    }
  };
  
  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {renderLoader()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
