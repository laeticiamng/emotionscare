
import React from 'react';

interface LoadingIllustrationProps {
  text?: string;
}

export const LoadingIllustration: React.FC<LoadingIllustrationProps> = ({ 
  text = 'Chargement...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full"></div>
      </div>
      <p className="mt-4 text-lg text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
};
