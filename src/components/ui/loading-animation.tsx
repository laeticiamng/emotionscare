
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  text?: string;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = "Chargement...", 
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      {text && <p className="mt-4 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingAnimation;
