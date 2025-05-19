
import React from 'react';
import { Slider } from '@/components/ui/slider';
import type { ProgressBarProps } from '@/types/music';

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value = 0,
  max = 100,
  onChange,
  currentTime = 0,
  duration = 0,
  onSeek,
  formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}) => {
  const handleChange = (values: number[]) => {
    const newValue = values[0];
    if (onChange) {
      onChange(newValue);
    }
    if (onSeek && duration) {
      const seekTime = (newValue / 100) * duration;
      onSeek(seekTime);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <Slider
        value={[progress]}
        max={100}
        step={0.1}
        onValueChange={handleChange}
        className="cursor-pointer"
        aria-label="Audio progress"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
