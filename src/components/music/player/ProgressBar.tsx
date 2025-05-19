
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime = 0,
  duration = 0,
  onSeek,
  formatTime = (seconds) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
}) => {
  const handleSeek = (value: number[]) => {
    if (onSeek) {
      onSeek(value[0]);
    }
  };

  return (
    <div className="w-full space-y-1">
      <Slider
        value={[currentTime]} 
        max={duration || 100}
        step={1}
        onValueChange={handleSeek}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
