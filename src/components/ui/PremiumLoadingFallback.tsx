/**
 * Premium Loading Fallback - Écran de chargement premium
 * Utilisé comme fallback pour le lazy loading des pages
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumLoadingFallbackProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  message?: string;
  showProgress?: boolean;
}

export const PremiumLoadingFallback: React.FC<PremiumLoadingFallbackProps> = ({
  className,
  size = 'full',
  message = 'Chargement...',
  showProgress = true
}) => {
  const sizeClasses = {
    sm: 'h-32',
    md: 'h-64',
    lg: 'h-96',
    full: 'min-h-screen'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      "bg-gradient-to-br from-background via-background/95 to-primary/5",
      sizeClasses[size],
      className
    )}>
      {/* Main Loading Animation */}
      <div className="flex flex-col items-center space-y-6">
        
        {/* Logo Animation */}
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Outer Ring */}
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Icons */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-8 h-8 text-primary" />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-3 h-3 text-red-500" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ y: [2, -2, 2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <Zap className="w-3 h-3 text-yellow-500" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div 
          className="text-center space-y-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-foreground">
            {message}
          </h2>
          <p className="text-sm text-muted-foreground">
            Préparation de votre expérience premium...
          </p>
        </motion.div>

        {/* Progress Indicators */}
        {showProgress && (
          <motion.div 
            className="w-full max-w-xs space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              />
            </div>

            {/* Loading Steps */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Initialisation
              </motion.span>
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              >
                Configuration
              </motion.span>
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
              >
                Finalisation
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Spinning Loader as Backup */}
        <motion.div
          className="flex items-center space-x-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>EmotionsCare Premium</span>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default PremiumLoadingFallback;