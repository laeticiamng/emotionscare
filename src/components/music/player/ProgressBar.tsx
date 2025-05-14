
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { ProgressBarProps } from '@/types/music';

const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  currentTime,
  onSeek, // Add onSeek prop
  formatTime = defaultFormatTime,
  showTimestamps = true,
  className = ''
}) => {
  // Default time formatter
  function defaultFormatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showTimestamps && (
        <span className="text-xs text-muted-foreground min-w-[40px]">
          {formatTime(currentTime)}
        </span>
      )}
      <Slider
        value={[progressPercent]}
        max={100}
        step={0.1}
        onValueChange={(values) => {
          if (onSeek) {
            const newTime = (values[0] / 100) * duration;
            onSeek(newTime);
          }
        }}
        className="flex-1"
        aria-label="Progress bar"
      />
      {showTimestamps && (
        <span className="text-xs text-muted-foreground min-w-[40px] text-right">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
