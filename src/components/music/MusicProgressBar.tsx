
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  value, // Added for compatibility
  max = 100, // Added with default
  onSeek,
  className = "",
  currentTime = 0, // Added with default
  duration = 100, // Added with default
  formatTime, // Added
  showTimestamps = true // Added with default
}) => {
  const defaultFormatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const timeFormatter = formatTime || defaultFormatTime;
  const currentTimeValue = typeof progress === 'number' ? timeFormatter(progress) : timeFormatter(currentTime);
  const totalTimeValue = typeof duration === 'number' ? timeFormatter(duration) : timeFormatter(100);
  const progressValue = typeof progress === 'number' ? progress : (value !== undefined ? value : 0);

  return (
    <div className={`space-y-2 ${className}`}>
      <Slider
        defaultValue={[0]}
        value={[progressValue]}
        max={max}
        step={1}
        onValueChange={onSeek ? (value) => onSeek(value[0]) : undefined}
      />
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentTimeValue}</span>
          <span>{totalTimeValue}</span>
        </div>
      )}
    </div>
  );
};

export default MusicProgressBar;
