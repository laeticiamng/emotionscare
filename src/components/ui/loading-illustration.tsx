
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingIllustrationProps {
  className?: string;
}

export const LoadingIllustration: React.FC<LoadingIllustrationProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center min-h-screen", className)}>
      <div className="text-center">
        <div className="animate-pulse">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/20"></div>
        </div>
        <p className="mt-4 text-lg font-medium">EmotionsCare</p>
        <p className="text-sm text-muted-foreground">Chargement en cours...</p>
      </div>
    </div>
  );
};
