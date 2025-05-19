
import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';

interface MusicVisualizerProps {
  className?: string;
  color?: string;
  barCount?: number;
  height?: number;
  responsive?: boolean;
  animated?: boolean;
  style?: 'bars' | 'wave' | 'circle';
}

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  className,
  color = 'currentColor',
  barCount = 32,
  height = 40,
  responsive = true,
  animated = true,
  style = 'bars'
}) => {
  const { isPlaying, currentTrack } = useMusic();
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0));
  
  useEffect(() => {
    if (!animated) {
      // Set static visualizer when not animated
      setBars(Array(barCount).fill(0).map(() => Math.random() * 0.8 + 0.2));
      return;
    }
    
    // Only animate when playing
    if (isPlaying) {
      const animate = () => {
        // Simulate audio frequency data with randomized bars
        // In a real implementation, this would use actual audio data
        const newBars = bars.map(bar => {
          // Create a smoothed random value that gradually changes
          const target = Math.random();
          const current = bar;
          // Smooth transition between current and target
          return current + (target - current) * 0.15;
        });
        
        setBars(newBars);
        requestRef.current = requestAnimationFrame(animate);
      };
      
      requestRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    } else {
      // When paused, gradually decrease bar heights
      const animate = () => {
        const newBars = bars.map(bar => Math.max(0, bar * 0.95));
        setBars(newBars);
        
        // Continue animation until all bars are nearly zero
        if (newBars.some(bar => bar > 0.01)) {
          requestRef.current = requestAnimationFrame(animate);
        }
      };
      
      requestRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isPlaying, bars, animated, barCount]);
  
  // If no track is playing, show minimal static visualizer
  if (!currentTrack) {
    return (
      <div 
        className={cn("flex items-end justify-center gap-0.5", className)} 
        style={{ height: responsive ? 'auto' : height }}
      >
        {Array(Math.min(12, barCount)).fill(0).map((_, i) => (
          <div 
            key={i}
            className="bg-muted/30 rounded-md w-1"
            style={{ height: 4 }}
          />
        ))}
      </div>
    );
  }
  
  if (style === 'wave') {
    // Wave style visualizer
    return (
      <div 
        className={cn("flex items-center justify-center h-full w-full", className)}
        ref={containerRef}
      >
        <svg 
          width="100%" 
          height={responsive ? '100%' : height} 
          viewBox={`0 0 ${barCount * 2} 100`}
          preserveAspectRatio="none"
        >
          <path
            d={`M 0,50 ${bars.map((bar, i) => {
              const x = i * 2;
              const y = 50 - bar * 40;
              return `L ${x},${y}`;
            }).join(' ')} L ${barCount * 2},50`}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-75"
          />
        </svg>
      </div>
    );
  } else if (style === 'circle') {
    // Circle style visualizer
    return (
      <div 
        className={cn("relative flex items-center justify-center", className)}
        style={{ height: responsive ? '100%' : height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-primary/10 p-8">
            <div className="rounded-full bg-primary/20 p-4">
              <div className="rounded-full bg-primary/30 p-2"></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {bars.map((bar, i) => {
            const rotation = (i / barCount) * 360;
            const height = 10 + bar * 30;
            return (
              <div
                key={i}
                className="absolute bg-primary origin-bottom rounded-t-full transition-all duration-100"
                style={{
                  height: `${height}%`,
                  width: '2px',
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'center bottom',
                  opacity: 0.5 + bar * 0.5
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
  
  // Default bar style visualizer
  return (
    <div 
      className={cn("flex items-end justify-center gap-0.5", className)} 
      style={{ height: responsive ? 'auto' : height }}
      ref={containerRef}
    >
      {bars.map((bar, i) => (
        <div 
          key={i}
          className="bg-primary rounded-md w-1 transition-all duration-75"
          style={{ height: `${Math.max(4, bar * height)}px` }}
        />
      ))}
    </div>
  );
};

export default MusicVisualizer;
