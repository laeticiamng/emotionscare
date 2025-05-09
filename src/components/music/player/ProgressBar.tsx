
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types';

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime,
  duration,
  onSeek,
  formatTime,
  handleProgressClick
}) => {
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const defaultFormatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeFormatter = formatTime || defaultFormatTime;
  
  return (
    <div className="w-full space-y-1" onClick={handleProgressClick}>
      <Slider
        value={[percent]}
        max={100}
        step={0.1}
        onValueChange={(values) => onSeek((values[0] / 100) * duration)}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground px-0.5">
        <span>{timeFormatter(currentTime)}</span>
        <span>{timeFormatter(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
