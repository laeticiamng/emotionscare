
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  text?: string;
  className?: string;
  iconClassName?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = "Chargement...", 
  className,
  iconClassName
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)} role="status" aria-live="polite">
      <div className="w-12 h-12 relative">
        <div className={cn("absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary/20 border-t-primary animate-spin", iconClassName)}></div>
      </div>
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  );
};

export default LoadingAnimation;
