
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className = '',
  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },
  showTimestamps = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(0);

  const handleValueChange = (value: number[]) => {
    setLocalValue(value[0]);
    setIsDragging(true);
  };

  const handleValueCommit = (value: number[]) => {
    onSeek(value[0]);
    setIsDragging(false);
  };
  
  const displayValue = isDragging ? localValue : currentTime;
  
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <Slider
        defaultValue={[0]}
        value={[displayValue]}
        max={duration || 100}
        step={1}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        aria-label="Music progress"
      />
      
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(displayValue)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default MusicProgressBar;
