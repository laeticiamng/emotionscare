
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingAnimationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  text = 'Chargement en cours...',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeMap[size]}`} />
      {text && <p className="mt-4 text-muted-foreground text-center">{text}</p>}
    </div>
  );
};

export default LoadingAnimation;
