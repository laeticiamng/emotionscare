
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { ProgressBarProps } from '@/types/music';

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime, 
  duration, 
  onSeek 
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (value: number[]) => {
    onSeek(value[0]);
  };

  return (
    <div className="space-y-1">
      <Slider 
        value={[currentTime]} 
        max={Math.max(duration, 1)} 
        step={0.1} 
        onValueChange={handleSeek}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};
