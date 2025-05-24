
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoadingAnimationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = "Chargement...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex items-center justify-center"
      >
        <Heart className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground text-center"
        >
          {text}
        </motion.p>
      )}
      
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;
