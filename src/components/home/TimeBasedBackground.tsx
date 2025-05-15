
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TimeOfDay, determineTimeOfDay } from '@/constants/defaults';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const TimeBasedBackground: React.FC<TimeBasedBackgroundProps> = ({ children, className = '' }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(determineTimeOfDay());

  useEffect(() => {
    // Update based on time of day
    setTimeOfDay(determineTimeOfDay());

    // Update every 15 minutes
    const intervalId = setInterval(() => {
      setTimeOfDay(determineTimeOfDay());
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div 
      className={`min-h-screen w-full relative overflow-hidden transition-colors duration-1000 
        ${timeOfDay === TimeOfDay.MORNING ? 'bg-morning' : 
          timeOfDay === TimeOfDay.AFTERNOON ? 'bg-afternoon' : 
          timeOfDay === TimeOfDay.EVENING ? 'bg-evening' : 
          'bg-night'} ${className}`}
    >
      {/* Background animation elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1], 
            scale: [1, 1.1, 1],
            x: ['-10%', '5%', '-10%'],
            y: ['-10%', '5%', '-10%']
          }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.15, 0.1], 
            scale: [0.9, 1.1, 0.9],
            x: ['10%', '-5%', '10%'],
            y: ['20%', '5%', '20%']
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 blur-3xl"
        />
      </div>
      
      {children}
    </div>
  );
};

export default TimeBasedBackground;
