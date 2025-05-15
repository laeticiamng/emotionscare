
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  currentTime = 0,
  duration = 100,
  onSeek,
  className = "",
  formatTime,
  showTimestamps = true
}) => {
  const defaultFormatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const timeFormatter = formatTime || defaultFormatTime;
  const currentTimeValue = timeFormatter(currentTime);
  const totalTimeValue = timeFormatter(duration);

  return (
    <div className={`space-y-2 ${className}`}>
      <Slider
        defaultValue={[0]}
        value={[value]}
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
