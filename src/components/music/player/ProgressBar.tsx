
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
  handleProgressClick,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div 
        className="w-full h-2 bg-muted rounded-full overflow-hidden cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-primary"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
