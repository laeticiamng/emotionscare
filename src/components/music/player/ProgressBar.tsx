import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = false,
  className = '',
  variant = 'default',
  currentTime = 0,
  duration = 0,
  formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`,
  onSeek,
  showTimestamps = true,
}) => {
  const handleSliderChange = (values: number[]) => {
    if (onSeek) {
      onSeek(values[0]);
    }
  };

  return (
    <div className={className}>
      <div
        className="relative w-full"
        onClick={handleProgressClick}
      >
        <Slider
          value={[value]}
          max={max}
          step={0.1}
          className="mb-1"
          onValueChange={handleSliderChange}
        />
      </div>
      
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
      
      {showLabel && (
        <div className="text-center text-xs text-muted-foreground mt-1">
          {Math.round(value)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
