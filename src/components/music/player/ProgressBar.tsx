
import React from 'react';
import { ProgressBarProps } from '@/types/music';

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentTime, 
  duration, 
  onSeek,
  formatTime
}) => {
  const progress = (currentTime / duration) * 100 || 0;
  
  // Default format function if none provided
  const defaultFormatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timeFormatter = formatTime || defaultFormatTime;

  // Handle click on the progress bar
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent * duration);
  };

  return (
    <div className="w-full space-y-1">
      <div 
        className="h-1 bg-blue-200 dark:bg-blue-800/30 rounded-full overflow-hidden cursor-pointer"
        onClick={handleProgressBarClick}
      >
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-blue-600/70 dark:text-blue-400/70">
        <span>{timeFormatter(currentTime || 0)}</span>
        <span>{timeFormatter(duration || 0)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
