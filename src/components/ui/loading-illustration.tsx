
import React from 'react';

interface LoadingIllustrationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingIllustration: React.FC<LoadingIllustrationProps> = ({ 
  text = "Chargement...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className={`animate-spin rounded-full border-b-2 border-primary mb-4 ${sizeClasses[size]}`}></div>
      <p className="text-muted-foreground text-center">{text}</p>
    </div>
  );
};
