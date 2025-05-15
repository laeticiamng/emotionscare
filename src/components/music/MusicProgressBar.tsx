
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  onSeek,
  className = ""
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentTime = typeof progress === 'number' ? formatTime(progress) : '0:00';
  const totalTime = typeof progress === 'number' ? formatTime(100) : '0:00';

  return (
    <div className={`space-y-2 ${className}`}>
      <Slider
        defaultValue={[0]}
        value={[typeof progress === 'number' ? progress : 0]}
        max={100}
        step={1}
        onValueChange={onSeek ? (value) => onSeek(value[0]) : undefined}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{currentTime}</span>
        <span>{totalTime}</span>
      </div>
    </div>
  );
};

export default MusicProgressBar;
