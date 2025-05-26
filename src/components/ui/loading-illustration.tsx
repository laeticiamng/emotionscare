
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIllustrationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingIllustration: React.FC<LoadingIllustrationProps> = ({ 
  text = 'Chargement...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  );
};

export { LoadingIllustration };
