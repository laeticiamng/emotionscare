
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress,
  total,
  onSeek,
  currentTime = 0,
  duration = 0,
  formatTime
}) => {
  // Use either progress/total or currentTime/duration
  const sliderValue = progress !== undefined ? progress : currentTime;
  const sliderMax = total !== undefined ? total : duration || 1;
  
  const formatTimeDefault = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  
  const timeFormatter = formatTime || formatTimeDefault;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground min-w-12 text-right">
        {timeFormatter(sliderValue)}
      </span>
      
      <Slider
        value={[sliderValue]}
        max={sliderMax}
        step={1}
        onValueChange={(values) => onSeek && onSeek(values[0])}
        className="flex-1"
      />
      
      <span className="text-xs text-muted-foreground min-w-12 text-left">
        {timeFormatter(sliderMax)}
      </span>
    </div>
  );
};

export default ProgressBar;
