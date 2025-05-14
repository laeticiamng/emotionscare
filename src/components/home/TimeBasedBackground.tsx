
import React, { useEffect, useState } from 'react';
import { TIME_OF_DAY } from '@/constants/defaults';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function TimeBasedBackground({ children, className = '' }: TimeBasedBackgroundProps) {
  const [timeOfDay, setTimeOfDay] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay(TIME_OF_DAY.MORNING);
    else if (hour >= 12 && hour < 18) setTimeOfDay(TIME_OF_DAY.AFTERNOON);
    else if (hour >= 18 && hour < 22) setTimeOfDay(TIME_OF_DAY.EVENING);
    else setTimeOfDay(TIME_OF_DAY.NIGHT);
  }, []);
  
  const getBackgroundClasses = () => {
    switch(timeOfDay) {
      case TIME_OF_DAY.MORNING:
        return 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-sky-950 dark:via-blue-900 dark:to-indigo-950';
      case TIME_OF_DAY.AFTERNOON:
        return 'bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100 dark:from-blue-950 dark:via-sky-900 dark:to-cyan-950';
      case TIME_OF_DAY.EVENING:
        return 'bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 dark:from-amber-950 dark:via-orange-900 dark:to-rose-950';
      case TIME_OF_DAY.NIGHT:
        return 'bg-gradient-to-br from-indigo-200 via-purple-100 to-slate-200 dark:from-indigo-950 dark:via-purple-900 dark:to-slate-950';
      default:
        return 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950';
    }
  };
  
  return (
    <div className={`min-h-full transition-all duration-1000 ease-in-out ${getBackgroundClasses()} ${className}`}>
      <div className="relative z-10 min-h-full">
        {children}
      </div>
      <div className="absolute inset-0 bg-cover bg-center mix-blend-soft-light opacity-20 z-0">
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
      </div>
    </div>
  );
}
