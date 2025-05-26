
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  text?: string;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = 'Chargement...', 
  className 
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-4',
      className
    )}>
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingAnimation;
