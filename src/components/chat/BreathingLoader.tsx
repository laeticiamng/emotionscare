import React from 'react';
import { cn } from '@/lib/utils';

interface BreathingLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const BreathingLoader: React.FC<BreathingLoaderProps> = ({
  className,
  size = 'md',
  color,
}) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div 
        className={cn(
          "rounded-full bg-primary animate-pulse", 
          sizeClasses[size], 
          "opacity-70 [animation-delay:-0.3s]",
          className
        )}
        style={color ? { backgroundColor: color } : {}}
      />
      <div 
        className={cn(
          "rounded-full bg-primary animate-pulse", 
          sizeClasses[size], 
          "opacity-80 [animation-delay:-0.15s]",
          className
        )}
        style={color ? { backgroundColor: color } : {}}
      />
      <div 
        className={cn(
          "rounded-full bg-primary animate-pulse", 
          sizeClasses[size], 
          "opacity-90",
          className
        )}
        style={color ? { backgroundColor: color } : {}}
      />
    </div>
  );
};

export default BreathingLoader;
