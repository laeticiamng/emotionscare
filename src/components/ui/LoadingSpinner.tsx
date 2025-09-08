import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={cn('flex items-center justify-center', text && 'gap-3')}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-transparent border-t-primary',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Chargement en cours"
      />
      {text && <span className="text-sm font-medium text-muted-foreground">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;