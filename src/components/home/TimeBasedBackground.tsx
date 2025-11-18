
import React, { useState, useEffect } from 'react';
import { TimeOfDay } from '@/constants/defaults';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
}

const TimeBasedBackground: React.FC<TimeBasedBackgroundProps> = ({ children }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TimeOfDay.MORNING);

  useEffect(() => {
    const determineTimeOfDay = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        return TimeOfDay.MORNING;
      } else if (hour >= 12 && hour < 17) {
        return TimeOfDay.AFTERNOON;
      } else if (hour >= 17 && hour < 22) {
        return TimeOfDay.EVENING;
      } else {
        return TimeOfDay.NIGHT;
      }
    };
    
    setTimeOfDay(determineTimeOfDay());
    
    // Update time of day every 15 minutes
    const interval = setInterval(() => {
      setTimeOfDay(determineTimeOfDay());
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getBackgroundStyles = () => {
    switch (timeOfDay) {
      case TimeOfDay.MORNING:
        return 'bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200';
      case TimeOfDay.AFTERNOON:
        return 'bg-gradient-to-b from-blue-100 via-sky-100 to-sky-200';
      case TimeOfDay.EVENING:
        return 'bg-gradient-to-b from-orange-100 via-amber-100 to-purple-200';
      case TimeOfDay.NIGHT:
        return 'bg-gradient-to-b from-gray-900 via-indigo-900 to-blue-900';
      default:
        return 'bg-gradient-to-b from-blue-50 to-blue-100';
    }
  };
  
  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getBackgroundStyles()}`}>
      {children}
    </div>
  );
};

export default TimeBasedBackground;
