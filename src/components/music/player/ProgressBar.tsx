
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek
}) => {
  // Formater le temps en minutes:secondes
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  return (
    <div className="space-y-1">
      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={0.1}
        onValueChange={(value) => onSeek(value[0])}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
