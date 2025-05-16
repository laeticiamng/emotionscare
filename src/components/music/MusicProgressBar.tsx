
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

export const MusicProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className = '',
  formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  },
  showTimestamps = true,
}) => {
  const handleChange = (value: number[]) => {
    onSeek(value[0]);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
      <Slider
        defaultValue={[currentTime]}
        value={[currentTime]}
        max={duration || 100}
        step={0.1}
        onValueChange={handleChange}
        className="cursor-pointer"
        aria-label="Progression du morceau"
      />
    </div>
  );
};

export default MusicProgressBar;
