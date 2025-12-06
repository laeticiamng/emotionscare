
import React from 'react';
import { Slider } from '@/components/ui/slider';

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export const MusicProgressBar: React.FC<ProgressBarProps> = ({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  },
  showTimestamps = true,
}) => {
  const handleChange = (value: number[]) => {
    if (onSeek) {
      onSeek(value[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime || 0)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
      )}
      <Slider
        defaultValue={[currentTime || 0]}
        value={[currentTime || 0]}
        max={duration || 100}
        step={0.1}
        onValueChange={handleChange}
        className="cursor-pointer"
        aria-label="Progression du morceau"
      />
    </div>
  );
};

export default MusicProgressBar;
