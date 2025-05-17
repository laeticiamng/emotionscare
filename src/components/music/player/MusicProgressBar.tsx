import React from 'react';

export interface ProgressBarProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  position?: number;
  currentTime?: number;
  duration?: number;
  className?: string;
  formatTime?: (seconds: number) => string;
  onSeek?: (value: number) => void;
  showTimestamps?: boolean;
}

const MusicProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  onChange,
  position,
  currentTime = 0,
  duration = 0,
  className = "",
  formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`,
  onSeek,
  showTimestamps = true
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange?.(newValue);
    onSeek?.(newValue);
  };

  const thumbPosition = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center ${className}`}>
      {showTimestamps && (
        <span className="text-xs text-muted-foreground mr-2">{formatTime(currentTime)}</span>
      )}
      <div className="relative flex-1">
        <input
          type="range"
          min={0}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="
            w-full h-1 bg-input rounded-full appearance-none
            cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary
            [&::-webkit-slider-thumb]:(
              appearance-none w-4 h-4 bg-primary rounded-full border-none
              cursor-pointer
              transition-transform duration-200
              transform translate-y-[-1.5px]
            )
            [&::-moz-range-thumb]:(
              appearance-none w-4 h-4 bg-primary rounded-full border-none
              cursor-pointer
              transition-transform duration-200
            )
          "
        />
        <div
          className="absolute top-0 left-0 h-1 bg-primary rounded-full pointer-events-none"
          style={{ width: `${thumbPosition}%` }}
        />
      </div>
      {showTimestamps && (
        <span className="text-xs text-muted-foreground ml-2">{formatTime(duration)}</span>
      )}
    </div>
  );
};

export default MusicProgressBar;
