
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  text = "Chargement...", 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} animate-spin text-primary`} 
        aria-label="Chargement en cours"
      />
      {text && (
        <p className="text-muted-foreground text-center" role="status" aria-live="polite">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingAnimation;
