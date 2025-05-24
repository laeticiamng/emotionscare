
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoadingAnimationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  showLogo?: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = "Chargement...", 
  size = 'md',
  showLogo = true 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {showLogo && (
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center space-x-2"
        >
          <Heart className={`${sizeClasses[size]} text-primary`} />
          <span className={`font-bold ${textSizeClasses[size]} text-primary`}>
            EmotionsCare
          </span>
        </motion.div>
      )}
      
      <div className="flex items-center space-x-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full`}
        />
        <span className={`${textSizeClasses[size]} text-muted-foreground`}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default LoadingAnimation;
