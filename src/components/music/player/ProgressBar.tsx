
import React from 'react';
import { ProgressBarProps } from '@/types';

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  currentTime = 0,
  duration = 0,
  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
  handleProgressClick
}) => {
  const progressWidth = `${(value / max) * 100}%`;

  return (
    <div className="space-y-1">
      <div 
        className="h-2 bg-muted rounded-full relative cursor-pointer overflow-hidden"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100"
          style={{ width: progressWidth }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
