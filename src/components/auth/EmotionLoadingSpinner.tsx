
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmotionLoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
  emotion?: 'happy' | 'calm' | 'focused' | 'default';
}

const EmotionLoadingSpinner: React.FC<EmotionLoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Chargement en cours...',
  className,
  emotion = 'default'
}) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-16 w-16',
    large: 'h-24 w-24'
  };

  const emotionColors = {
    happy: {
      primary: 'from-yellow-300 to-amber-500',
      secondary: 'from-orange-300 to-amber-400'
    },
    calm: {
      primary: 'from-blue-300 to-cyan-500', 
      secondary: 'from-indigo-300 to-sky-400'
    },
    focused: {
      primary: 'from-purple-300 to-indigo-600',
      secondary: 'from-violet-300 to-purple-500'
    },
    default: {
      primary: 'from-primary/70 to-primary',
      secondary: 'from-primary/50 to-primary/80'
    }
  };

  const colors = emotionColors[emotion];

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative">
        <motion.div
          className={cn(
            'rounded-full border-4 bg-gradient-to-r',
            colors.primary,
            sizeClasses[size]
          )}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className={cn(
            'absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-l',
            colors.secondary
          )}
          style={{ borderRightColor: 'transparent', borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "linear" 
          }}
        />
      </div>
      
      {text && (
        <motion.p 
          className="mt-4 text-sm font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default EmotionLoadingSpinner;
