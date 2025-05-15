
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TimeOfDay } from '@/constants/defaults';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const TimeBasedBackground: React.FC<TimeBasedBackgroundProps> = ({ 
  children,
  className = ''
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TimeOfDay.MORNING);
  
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        setTimeOfDay(TimeOfDay.MORNING);
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay(TimeOfDay.AFTERNOON);
      } else if (hour >= 18 && hour < 22) {
        setTimeOfDay(TimeOfDay.EVENING);
      } else {
        setTimeOfDay(TimeOfDay.NIGHT);
      }
    };
    
    updateTimeOfDay();
    
    // Update time of day every 15 minutes
    const interval = setInterval(updateTimeOfDay, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-1000 
      ${timeOfDay === TimeOfDay.MORNING ? 'bg-morning' : 
      timeOfDay === TimeOfDay.AFTERNOON ? 'bg-afternoon' : 
      timeOfDay === TimeOfDay.EVENING ? 'bg-evening' : 
      'bg-night'} ${className}`}
    >
      {/* Ambient animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1], 
            scale: [0.8, 1.1, 0.8],
            x: ['-10%', '5%', '-10%'],
            y: ['-10%', '5%', '-10%']
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: [0.1, 0.15, 0.1], 
            scale: [0.8, 1.2, 0.8],
            x: ['10%', '-5%', '10%'],
            y: ['20%', '5%', '20%']
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute -bottom-[50%] -right-[20%] w-[90%] h-[90%] rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 blur-3xl"
        />
      </div>
      
      {children}
    </div>
  );
};
