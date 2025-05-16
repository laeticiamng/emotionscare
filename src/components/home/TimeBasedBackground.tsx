
import React, { useEffect, useState } from 'react';
import { determineTimeOfDay } from '@/constants/defaults';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const TimeBasedBackground: React.FC<TimeBasedBackgroundProps> = ({
  children,
  className = '',
}) => {
  const [timeOfDay, setTimeOfDay] = useState(determineTimeOfDay());
  
  useEffect(() => {
    // Update the time of day every hour
    const interval = setInterval(() => {
      setTimeOfDay(determineTimeOfDay());
    }, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getBackgroundStyle = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-gradient-to-br from-blue-50 via-amber-50 to-blue-100 dark:from-blue-950/50 dark:via-blue-900/30 dark:to-indigo-950/40';
      case 'afternoon':
        return 'bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100 dark:from-blue-900/40 dark:via-purple-900/20 dark:to-blue-900/30';
      case 'evening':
        return 'bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100 dark:from-purple-950/50 dark:via-blue-950/30 dark:to-indigo-950/40';
      case 'night':
        return 'bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900';
      default:
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/30';
    }
  };
  
  return (
    <div className={`min-h-screen ${getBackgroundStyle()} ${className}`}>
      <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px]"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
