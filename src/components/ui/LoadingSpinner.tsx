// @ts-nocheck
/**
 * COMPOSANT LOADING SPINNER - ACCESSIBLE ET OPTIMISÉ
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'muted';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  text,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variantClasses = {
    default: 'border-muted border-t-primary',
    primary: 'border-primary/30 border-t-primary',
    secondary: 'border-secondary/30 border-t-secondary',
    muted: 'border-muted-foreground/30 border-t-muted-foreground'
  };

  const spinner = (
    <div className={cn('flex items-center justify-center', text && 'gap-3')}>
      <div
        className={cn(
          'animate-spin rounded-full border-2',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        role="status"
        aria-label={text || "Chargement en cours"}
      />
      {text && (
        <span className="text-sm font-medium text-muted-foreground">
          {text}
        </span>
      )}
      <span className="sr-only">{text || "Chargement en cours..."}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;