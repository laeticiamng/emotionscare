
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ProgressBarProps } from '@/types/progress-bar';

// Default time formatter
const defaultFormatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  onChange,
  formatTime = defaultFormatTime,
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  showTimestamps = true,
  handleProgressClick,
  progress,
  variant = 'default',
  showLabel = false
}) => {
  // Use either value or progress for backward compatibility
  const progressValue = progress !== undefined ? progress : value;
  
  // Handle seeking
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (handleProgressClick) {
      handleProgressClick(e);
      return;
    }

    if (onSeek) {
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const seekTime = position * duration;
      onSeek(seekTime);
    } else if (onChange) {
      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const newValue = position * max;
      onChange(newValue);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div 
        className="relative w-full h-2 cursor-pointer"
        onClick={handleClick}
      >
        <Progress 
          value={progressValue} 
          max={max} 
          className="h-2"
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
