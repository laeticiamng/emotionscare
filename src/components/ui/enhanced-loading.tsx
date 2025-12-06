import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Heart, Sparkles } from 'lucide-react';

interface EnhancedLoadingProps {
  text?: string;
  variant?: 'default' | 'emotion' | 'music' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

const loadingVariants = {
  default: {
    icon: Loader2,
    className: "animate-spin text-blue-600"
  },
  emotion: {
    icon: Heart,
    className: "animate-pulse text-red-500"
  },
  music: {
    icon: Sparkles,
    className: "animate-bounce text-purple-600"
  },
  minimal: {
    icon: Loader2,
    className: "animate-spin text-gray-400"
  }
};

const sizeVariants = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12"
};

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  text = "Chargement...",
  variant = 'default',
  size = 'md'
}) => {
  const LoadingIcon = loadingVariants[variant].icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center space-y-4 p-8"
    >
      <div className="relative">
        <LoadingIcon 
          className={`${loadingVariants[variant].className} ${sizeVariants[size]}`}
        />
        {variant === 'emotion' && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full bg-red-200 opacity-30"
          />
        )}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-gray-600 dark:text-gray-300 font-medium"
      >
        {text}
      </motion.p>
      
      {/* Subtle progress indicator */}
      <motion.div 
        className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 w-full mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4"></div>
      <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2"></div>
    </div>
  </div>
);

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "" }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={`inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full ${className}`}
  />
);
