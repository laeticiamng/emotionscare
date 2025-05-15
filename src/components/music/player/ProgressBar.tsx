
import React from 'react';
import { ProgressBarProps } from '@/types';

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = true,
  className = '',
  variant = 'default',
  currentTime = 0,
  duration = 0,
  formatTime,
  handleProgressClick,
  showTimestamps = true
}) => {
  // Calculate progress percentage
  const progressPercentage = (value / max) * 100;
  
  // Define variant colors
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };
  
  // Format time if no formatter provided
  const defaultFormatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const timeFormatter = formatTime || defaultFormatTime;

  return (
    <div className={`w-full ${className}`}>
      {showTimestamps && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{timeFormatter(currentTime)}</span>
          <span>{timeFormatter(duration)}</span>
        </div>
      )}
      
      <div 
        className="h-1.5 w-full bg-muted rounded-full overflow-hidden cursor-pointer" 
        onClick={handleProgressClick}
      >
        <div 
          className={`h-full ${getVariantClasses()} rounded-full transition-all duration-300`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {showLabel && !showTimestamps && (
        <div className="mt-1 text-xs text-muted-foreground text-center">
          {Math.round(progressPercentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
