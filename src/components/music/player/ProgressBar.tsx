
import React from 'react';
import { ProgressBarProps } from '@/types';

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  formatTime,
  handleProgressClick,
  onSeek,
  showTimestamps = true,
  className = ''
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div
        className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
        onClick={handleProgressClick}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
      >
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
