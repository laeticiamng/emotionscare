
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ProgressBarProps } from '@/types/music';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  progress,
  max,
  className = '',
  formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
  showTimestamps = true
}) => {
  // Use progress or currentTime for slider value
  const sliderValue = progress !== undefined ? progress : currentTime;
  // Use max or duration for slider max
  const sliderMax = max !== undefined ? max : (duration || 1); // Avoid division by zero
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Slider
        value={[sliderValue]}
        max={sliderMax} 
        step={1}
        onValueChange={(values) => onSeek(values[0])}
      />
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default MusicProgressBar;
