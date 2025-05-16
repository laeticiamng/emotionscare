
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  max,
  onChange,
  className = '',
  formatTime,
  currentTime,
  duration,
  onSeek,
  value,
  showTimestamps = false
}) => {
  // Use provided props or fallbacks
  const actualProgress = value !== undefined ? value : progress;
  const actualMax = max || 100;
  const handleChange = onChange || onSeek || (() => {});
  
  const defaultFormatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const timeFormatter = formatTime || defaultFormatTime;
  
  return (
    <div className={`flex items-center ${className}`}>
      {showTimestamps && currentTime !== undefined && (
        <span className="text-xs text-muted-foreground mr-2">
          {timeFormatter(currentTime)}
        </span>
      )}
      
      <Slider
        value={[actualProgress || 0]}
        min={0}
        max={actualMax}
        step={1}
        onValueChange={(value) => handleChange(value[0])}
        className="cursor-pointer"
      />
      
      {showTimestamps && duration !== undefined && (
        <span className="text-xs text-muted-foreground ml-2">
          {timeFormatter(duration)}
        </span>
      )}
    </div>
  );
};

export default MusicProgressBar;
