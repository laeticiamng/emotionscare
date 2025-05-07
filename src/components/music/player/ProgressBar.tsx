
import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (time: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  formatTime,
  handleProgressClick
}) => {
  return (
    <div className="space-y-1 mb-4">
      <div 
        className="relative h-1.5 bg-secondary/50 rounded-full overflow-hidden cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute left-0 top-0 h-full bg-primary"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
