
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TimeOfDay, determineTimeOfDay } from '@/constants/defaults';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const TimeBasedBackground: React.FC<TimeBasedBackgroundProps> = ({ 
  children, 
  className = '' 
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(determineTimeOfDay());
  
  useEffect(() => {
    setTimeOfDay(determineTimeOfDay());
    
    // Update background every hour
    const interval = setInterval(() => {
      setTimeOfDay(determineTimeOfDay());
    }, 3600000); // 1 hour
    
    return () => clearInterval(interval);
  }, []);
  
  const getBackgroundClass = () => {
    switch(timeOfDay) {
      case TimeOfDay.MORNING:
        return 'bg-gradient-to-r from-blue-50 to-sky-100 dark:from-blue-950/80 dark:to-sky-900/80';
      case TimeOfDay.AFTERNOON:
        return 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/80 dark:to-orange-900/80';
      case TimeOfDay.EVENING:
        return 'bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950/80 dark:to-indigo-900/80';
      case TimeOfDay.NIGHT:
        return 'bg-gradient-to-br from-gray-800 to-slate-900 dark:from-gray-950 dark:to-slate-950/80';
      default:
        return 'bg-background';
    }
  };
  
  return (
    <div className={`min-h-screen ${getBackgroundClass()} transition-colors duration-1000 ${className}`}>
      {/* Ambient animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.05, 0.1, 0.05], 
            scale: [0.8, 1.1, 0.8],
            x: ['-10%', '5%', '-10%'],
            y: ['-10%', '5%', '-10%']
          }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.05, 0.1, 0.05], 
            scale: [0.8, 1.2, 0.8],
            x: ['10%', '-5%', '10%'],
            y: ['20%', '5%', '20%']
          }}
          transition={{ duration: 35, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute -bottom-[50%] -right-[20%] w-[90%] h-[90%] rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 blur-3xl"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default TimeBasedBackground;
