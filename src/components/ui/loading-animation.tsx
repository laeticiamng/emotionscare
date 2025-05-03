
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  text?: string;
  className?: string;
  iconClassName?: string;
}

const LoadingAnimation = ({ 
  text = "Chargement en cours...", 
  className,
  iconClassName 
}: LoadingAnimationProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-6", className)}>
      <Loader className={cn("h-8 w-8 animate-spin text-primary", iconClassName)} />
      <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingAnimation;
