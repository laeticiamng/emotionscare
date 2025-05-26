
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingIllustrationProps {
  className?: string;
  text?: string;
}

export const LoadingIllustration: React.FC<LoadingIllustrationProps> = ({
  className,
  text = 'Chargement...'
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center min-h-screen', className)}>
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">{text}</p>
    </div>
  );
};
