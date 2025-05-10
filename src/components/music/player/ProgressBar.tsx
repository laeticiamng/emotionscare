
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/audio-player';
import { formatTime as defaultFormatTime } from '@/lib/utils';

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime,
  duration,
  onSeek,
  showTimestamps = true,
  formatTime,
  handleProgressClick,
  className
}) => {
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const timeFormatter = formatTime || defaultFormatTime;
  
  // Fix the event handler to properly convert click to time
  const handleProgressClickInternal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (handleProgressClick) {
      handleProgressClick(e);
    }
  };
  
  return (
    <div 
      className={`w-full space-y-1 ${className || ''}`}
      onClick={handleProgressClick ? handleProgressClickInternal : undefined}
    >
      <Slider
        value={[percent]}
        max={100}
        step={0.1}
        onValueChange={onSeek ? (values) => onSeek((values[0] / 100) * duration) : undefined}
        className="w-full"
      />
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground px-0.5">
          <span>{timeFormatter(currentTime)}</span>
          <span>{timeFormatter(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
