import React, { useState, useCallback, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  markers?: { time: number; label: string; color?: string }[];
  showPreview?: boolean;
  buffered?: number;
  variant?: 'default' | 'minimal' | 'expanded';
}

export const MusicProgressBar: React.FC<ProgressBarProps> = ({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  },
  showTimestamps = true,
  markers = [],
  showPreview = true,
  buffered = 0,
  variant = 'default',
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((value: number[]) => {
    if (onSeek) {
      onSeek(value[0]);
    }
  }, [onSeek]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !showPreview) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    setHoverPosition(x);
    setHoverTime(percentage * duration);
  }, [duration, showPreview]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0;

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={cn('w-full', className)}>
        <Slider
          value={[currentTime || 0]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleChange}
          className="cursor-pointer"
          aria-label="Progression du morceau"
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Timestamps */}
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">{formatTime(currentTime || 0)}</span>
          <span className="font-mono tabular-nums">{formatTime(duration || 0)}</span>
        </div>
      )}

      {/* Progress bar container */}
      <div 
        ref={containerRef}
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Buffered indicator */}
        {buffered > 0 && variant === 'expanded' && (
          <div 
            className="absolute h-1 bg-muted-foreground/20 rounded-full top-1/2 -translate-y-1/2 left-0 pointer-events-none"
            style={{ width: `${bufferedProgress}%` }}
          />
        )}

        {/* Markers */}
        {markers.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {markers.map((marker, index) => {
              const markerPosition = duration > 0 ? (marker.time / duration) * 100 : 0;
              return (
                <div
                  key={index}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 w-1 h-3 rounded-full transition-opacity',
                    isHovering ? 'opacity-100' : 'opacity-50'
                  )}
                  style={{ 
                    left: `${markerPosition}%`,
                    backgroundColor: marker.color || 'hsl(var(--primary))'
                  }}
                  title={marker.label}
                />
              );
            })}
          </div>
        )}

        {/* Slider */}
        <Slider
          defaultValue={[currentTime || 0]}
          value={[currentTime || 0]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleChange}
          className={cn(
            'cursor-pointer',
            isHovering && 'scale-y-125 transition-transform'
          )}
          aria-label="Progression du morceau"
        />

        {/* Hover preview */}
        {showPreview && isHovering && duration > 0 && (
          <div
            className="absolute -top-8 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg pointer-events-none transform -translate-x-1/2 z-10"
            style={{ left: hoverPosition }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      {/* Expanded variant - additional info */}
      {variant === 'expanded' && (
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {Math.round(progress)}% joué
          </span>
          {buffered > 0 && (
            <span>
              {Math.round(bufferedProgress)}% chargé
            </span>
          )}
          <span>
            -{formatTime(Math.max(0, duration - currentTime))} restant
          </span>
        </div>
      )}

      {/* Markers legend */}
      {markers.length > 0 && variant === 'expanded' && (
        <div className="flex flex-wrap gap-2 mt-1">
          {markers.map((marker, index) => (
            <button
              key={index}
              onClick={() => onSeek(marker.time)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: marker.color || 'hsl(var(--primary))' }}
              />
              {marker.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicProgressBar;
