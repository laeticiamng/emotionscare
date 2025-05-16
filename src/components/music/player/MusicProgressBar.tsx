
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';
import { cn } from '@/lib/utils';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  position,
  max,
  onChange,
  currentTime = 0,
  duration = 0,
  formatTime,
  showTimestamps = false,
  className,
  onSeek
}) => {
  // Default formatter if none provided
  const defaultFormatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const timeFormatter = formatTime || defaultFormatTime;
  
  const handleChange = (value: number[]) => {
    const newPosition = value[0];
    if (onSeek) {
      onSeek(newPosition);
    } else {
      onChange(newPosition);
    }
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      <Slider
        value={[position]}
        max={max}
        step={1}
        onValueChange={handleChange}
        aria-label="Music progress"
      />
      
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{timeFormatter(currentTime)}</span>
          <span>{timeFormatter(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default MusicProgressBar;
