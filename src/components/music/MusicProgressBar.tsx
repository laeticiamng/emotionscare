
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { ProgressBarProps } from '@/types/music';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  max = 100,
  value = 0,
  currentTime = 0,
  duration = 0,
  onSeek,
  className = "",
  formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  },
  onChange,
  showTimestamps = false
}) => {
  // Use either progress or value
  const currentValue = value || progress;
  const maxValue = max || duration;
  
  const handleValueChange = (values: number[]) => {
    if (onSeek) {
      onSeek(values[0]);
    }
    if (onChange) {
      onChange(values[0]);
    }
  };
  
  return (
    <div className={`space-y-1 ${className}`}>
      <Slider
        value={[currentValue]}
        max={maxValue}
        step={1}
        onValueChange={handleValueChange}
      />
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime || currentValue)}</span>
          <span>{formatTime(duration || maxValue)}</span>
        </div>
      )}
    </div>
  );
};

export default MusicProgressBar;
