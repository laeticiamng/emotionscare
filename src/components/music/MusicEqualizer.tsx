import React, { useEffect, useState, useRef } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';

interface MusicEqualizerProps {
  className?: string;
  barCount?: number;
  activeColor?: string;
  inactiveColor?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MusicEqualizer: React.FC<MusicEqualizerProps> = ({
  className,
  barCount = 5,
  activeColor = 'bg-primary',
  inactiveColor = 'bg-primary/30',
  size = 'md'
}) => {
  const { state } = useMusic();
  const isPlaying = state.isPlaying;
  const [active, setActive] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  
  // Size configurations
  const sizeConfig = {
    sm: {
      height: 12,
      width: 2,
      gap: 1
    },
    md: {
      height: 16,
      width: 3,
      gap: 2
    },
    lg: {
      height: 24,
      width: 4,
      gap: 3
    }
  };
  
  const { height, width, gap } = sizeConfig[size];
  
  useEffect(() => {
    setActive(isPlaying);
    
    // Clean up any existing timeouts
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [isPlaying]);
  
  return (
    <div 
      className={cn("flex items-end justify-center", className)} 
      style={{ gap: `${gap}px` }}
    >
      {Array(barCount).fill(0).map((_, i) => {
        // Random height for each bar when active
        const barHeight = active ? 
          Math.max(0.3, Math.random()) * height : 
          height * 0.3;
        
        const animationDelay = `${i * 0.1}s`;
        
        return (
          <div 
            key={i}
            className={cn(
              "transition-all duration-200",
              active ? activeColor : inactiveColor
            )}
            style={{ 
              height: `${barHeight}px`, 
              width: `${width}px`,
              animationDelay,
              transition: `height ${Math.random() * 0.2 + 0.1}s ease-in-out`
            }}
          />
        );
      })}
    </div>
  );
};

export default MusicEqualizer;
