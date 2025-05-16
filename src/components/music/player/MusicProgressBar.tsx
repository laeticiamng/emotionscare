
import React from 'react';
import { ProgressBarProps } from '@/types/music';

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  position,
  max,
  onChange,
  currentTime = 0,
  duration = 0,
  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },
  showTimestamps = true,
  onSeek
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseFloat(e.target.value);
    if (onSeek) {
      onSeek(newPosition);
    } else {
      onChange(newPosition);
    }
  };

  return (
    <div className="w-full flex items-center space-x-2">
      {showTimestamps && (
        <span className="text-xs text-gray-500 w-8 text-right">
          {formatTime(currentTime)}
        </span>
      )}
      
      <div className="flex-grow relative">
        <input
          type="range"
          min={0}
          max={max}
          value={position}
          onChange={handleChange}
          className="w-full h-1 appearance-none bg-gray-300 rounded-full overflow-hidden"
          style={{
            background: `linear-gradient(to right, var(--color-primary, #3b82f6) 0%, var(--color-primary, #3b82f6) ${(position / max) * 100}%, #e5e7eb ${(position / max) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      
      {showTimestamps && (
        <span className="text-xs text-gray-500 w-8">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
};

export default MusicProgressBar;
