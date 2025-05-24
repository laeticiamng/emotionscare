
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingFallbackProps {
  className?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  className,
  text = "Chargement...",
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 space-y-4",
      className
    )}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

export const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingFallback size="lg" text="Chargement de la page..." />
  </div>
);

export const ComponentLoadingFallback: React.FC = () => (
  <LoadingFallback size="md" text="Chargement du composant..." />
);
