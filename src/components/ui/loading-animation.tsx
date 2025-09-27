import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Heart, Brain, Sparkles } from 'lucide-react';

export interface LoadingAnimationProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'emotion' | 'brain' | 'sparkles';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8'
};

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  muted: 'text-muted-foreground'
};

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  type = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  className
}) => {
  const baseClasses = cn(sizeClasses[size], colorClasses[color]);

  const renderAnimation = () => {
    switch (type) {
      case 'spinner':
        return <Loader2 className={cn(baseClasses, 'animate-spin')} />;
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-current',
                  size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3',
                  colorClasses[color]
                )}
                style={{
                  animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn(
            'rounded-full bg-current animate-pulse',
            size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-12 w-12' : 'h-16 w-16',
            colorClasses[color]
          )} />
        );
      
      case 'emotion':
        return <Heart className={cn(baseClasses, 'animate-pulse text-pink-500')} />;
      
      case 'brain':
        return <Brain className={cn(baseClasses, 'animate-pulse text-purple-500')} />;
      
      case 'sparkles':
        return <Sparkles className={cn(baseClasses, 'animate-pulse text-yellow-500')} />;
      
      default:
        return <Loader2 className={cn(baseClasses, 'animate-spin')} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      {renderAnimation()}
      {text && (
        <p className={cn('text-sm', colorClasses[color])}>
          {text}
        </p>
      )}
    </div>
  );
};

// CSS for dots animation (add to your global CSS)
const dotsKeyframes = `
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
`;

export default LoadingAnimation;