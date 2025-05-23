
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = "Chargement...", 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-16 w-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      <span className={`text-muted-foreground ${textSizeClasses[size]}`}>
        {text}
      </span>
    </div>
  );
};

export default LoadingAnimation;
