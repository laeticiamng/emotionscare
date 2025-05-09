
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/audio-player';

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onProgressClick,
  formatTime,
  handleProgressClick
}) => {
  // Default formatTime if not provided
  const formatTimeDefault = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Use provided formatTime or default implementation
  const formatTimeDisplay = formatTime || formatTimeDefault;
  
  // Use provided handleProgressClick or default to onProgressClick
  const handleProgressClickFn = handleProgressClick || onProgressClick || ((percent: number) => {});

  return (
    <div className="space-y-1">
      <Slider
        value={[currentTime]}
        max={duration || 1} // Prevent division by zero
        step={1}
        onValueChange={(values) => {
          const percent = (values[0] / (duration || 1)) * 100;
          handleProgressClickFn(percent);
        }}
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTimeDisplay(currentTime)}</span>
        <span>{formatTimeDisplay(duration || 0)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
