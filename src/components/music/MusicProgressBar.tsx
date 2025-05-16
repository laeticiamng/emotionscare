
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { MusicProgressBarProps } from '@/types/music';

const MusicProgressBar: React.FC<MusicProgressBarProps> = ({
  progress,
  max,
  currentTime,
  duration,
  onSeek,
  formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
  showTimestamps = true,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Slider
        value={[progress]}
        max={max || 1} // Avoid division by zero
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
