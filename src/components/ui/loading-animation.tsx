
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = 'Chargement...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <p className="text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingAnimation;
