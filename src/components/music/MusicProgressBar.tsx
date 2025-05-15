
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface MusicProgressBarProps {
  value?: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

const MusicProgressBar: React.FC<MusicProgressBarProps> = ({
  value = 0,
  max = 100,
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  },
  showTimestamps = true
}) => {
  const handleValueChange = (values: number[]) => {
    if (onSeek) {
      onSeek(values[0]);
    }
  };

  const sliderValue = value || currentTime;
  const sliderMax = max || duration || 100;

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <Slider
        value={[sliderValue]}
        max={sliderMax}
        step={1}
        onValueChange={handleValueChange}
        className="cursor-pointer"
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
