
import React, { useCallback } from 'react';
import { Slider } from '@/components/ui/slider';

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (seconds: number) => string;
  className?: string;
  showTimestamps?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  formatTime,
  className = '',
  showTimestamps = true,
}) => {
  // Format time (MM:SS) if not provided
  const defaultFormatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Use provided formatter or default
  const timeFormatter = formatTime || defaultFormatTime;

  // Handle slider value change
  const handleChange = useCallback(
    (value: number[]) => {
      onSeek(value[0]);
    },
    [onSeek]
  );

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <Slider
        value={[isNaN(currentTime) || !isFinite(duration) || duration <= 0 ? 0 : (currentTime / duration) * 100]}
        max={100}
        step={0.1}
        onValueChange={(value) => {
          const seekTime = (value[0] / 100) * duration;
          handleChange([seekTime]);
        }}
      />
      
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{timeFormatter(currentTime)}</span>
          <span>{timeFormatter(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
