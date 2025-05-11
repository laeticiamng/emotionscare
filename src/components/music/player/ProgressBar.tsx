
import React from 'react';
import { ProgressBarProps } from '@/types';
import { Slider } from '@/components/ui/slider';

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  formatTime,
  handleProgressClick,
  showTimestamps = true,
  className = ''
}) => {
  // Default time formatter function
  const defaultFormatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const timeFormatter = formatTime || defaultFormatTime;
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showTimestamps && (
        <div className="text-xs text-muted-foreground w-10 text-right">
          {timeFormatter(currentTime)}
        </div>
      )}
      
      <Slider
        value={[progressPercentage]}
        min={0}
        max={100}
        step={0.1}
        onValueChange={(value) => {
          const seekTime = (value[0] / 100) * duration;
          onSeek(seekTime);
        }}
        className="flex-1"
      />
      
      {showTimestamps && (
        <div className="text-xs text-muted-foreground w-10">
          {timeFormatter(duration || 0)}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
