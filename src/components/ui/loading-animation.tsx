import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Heart, Sparkles } from 'lucide-react';

interface LoadingAnimationProps {
  text?: string;
  variant?: 'default' | 'premium' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = "Chargement...", 
  variant = 'default',
  size = 'md'
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className={`animate-spin ${
          size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
        }`} />
      </div>
    );
  }

  if (variant === 'premium') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20"
          />
        </div>
        <div className="text-center">
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm font-medium text-muted-foreground"
          >
            {text}
          </motion.p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            >
              <Heart className="w-3 h-3 text-pink-500" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            >
              <Heart className="w-3 h-3 text-purple-500" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`rounded-full border-2 border-primary/20 border-t-primary ${
          size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'
        }`}
      />
      {text && (
        <motion.p 
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`text-muted-foreground font-medium ${
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          }`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingAnimation;