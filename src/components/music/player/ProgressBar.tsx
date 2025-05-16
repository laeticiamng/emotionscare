
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  total, 
  currentTime, 
  duration, 
  onSeek, 
  max = 100, 
  className = '', 
  formatTime,
  showTimestamps = true
}) => {
  
  // Create a default formatTime function if none is provided
  const formatTimeDefault = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const timeFormatter = formatTime || formatTimeDefault;
  
  return (
    <div className={`w-full space-y-1 ${className}`}>
      <div className="flex w-full items-center">
        <Slider
          value={[progress]}
          max={max}
          step={1}
          onValueChange={values => onSeek(values[0])}
          className="flex-1"
        />
      </div>
      
      {showTimestamps && currentTime !== undefined && duration !== undefined && (
        <div className="flex w-full justify-between text-xs text-muted-foreground">
          <span>{timeFormatter(currentTime)}</span>
          <span>{timeFormatter(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
