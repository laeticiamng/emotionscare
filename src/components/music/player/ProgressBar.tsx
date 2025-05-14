
import React, { useState } from 'react';
import { ProgressBarProps } from '@/types/music';
import { formatDuration } from '@/utils/formatters';

// Default format time function
const defaultFormatTime = (seconds: number): string => {
  return formatDuration(seconds);
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
  className = '',
  showTimestamps = true,
  formatTime = defaultFormatTime,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<number | null>(null);
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayPosition = isDragging && dragPosition !== null ? dragPosition : progressPercentage;
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickPercentage = (clickPositionX / progressBarWidth) * 100;
    const newTime = (clickPercentage / 100) * duration;
    
    onSeek(newTime);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mousePositionX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const percentage = (mousePositionX / progressBarWidth) * 100;
    
    setDragPosition(Math.max(0, Math.min(100, percentage)));
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || dragPosition === null) return;
    
    const newTime = (dragPosition / 100) * duration;
    onSeek(newTime);
    setIsDragging(false);
    setDragPosition(null);
  };
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div 
        className="h-1 bg-muted relative rounded-full cursor-pointer"
        onClick={handleProgressClick}
        onMouseDown={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => isDragging && setIsDragging(false)}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full"
          style={{ width: `${displayPosition}%` }}
        />
      </div>
      
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>{formatTime(currentTime)}</div>
          <div>{formatTime(duration)}</div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
