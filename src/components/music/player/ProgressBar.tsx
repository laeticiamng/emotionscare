
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (seconds: number) => string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },
  className
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs w-12 text-right">{formatTime(currentTime)}</span>
      <Slider
        className="flex-1"
        value={[progress]}
        min={0}
        max={100}
        step={0.1}
        onValueChange={(value) => {
          onSeek((value[0] / 100) * duration);
        }}
      />
      <span className="text-xs w-12">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;
