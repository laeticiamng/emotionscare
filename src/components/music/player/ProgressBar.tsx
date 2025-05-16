
import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  formatTime,
  onSeek
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };
  
  return (
    <div className="w-full space-y-1">
      <div className="relative h-1 bg-primary/20 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={currentTime}
        onChange={handleSeekChange}
        className="absolute w-full opacity-0 cursor-pointer top-0 left-0 h-1"
        style={{ margin: 0 }}
      />
    </div>
  );
};

export default ProgressBar;
