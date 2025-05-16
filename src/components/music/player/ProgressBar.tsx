
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime, 
  duration, 
  formatTime, 
  onSeek,
  max = 100 
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground min-w-12 text-right">
        {formatTime(currentTime)}
      </span>
      
      <Slider
        value={[currentTime]}
        max={duration || 1}
        step={1}
        onValueChange={(values) => onSeek(values[0])}
        className="flex-1"
      />
      
      <span className="text-xs text-muted-foreground min-w-12 text-left">
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default ProgressBar;
