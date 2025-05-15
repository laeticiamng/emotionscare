
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TimeOfDay } from '@/constants/defaults';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
}

export const TimeBasedBackground: React.FC<TimeBasedBackgroundProps> = ({ children }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TimeOfDay.MORNING);
  const [bgClass, setBgClass] = useState('bg-blue-50');
  
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    // Set time of day based on current hour
    if (hour >= 5 && hour < 12) {
      setTimeOfDay(TimeOfDay.MORNING);
      setBgClass('from-blue-50 to-purple-50 via-amber-50');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay(TimeOfDay.AFTERNOON);
      setBgClass('from-amber-50 to-blue-50 via-pink-50');
    } else if (hour >= 18 && hour < 22) {
      setTimeOfDay(TimeOfDay.EVENING);
      setBgClass('from-purple-100 to-rose-50 via-indigo-50');
    } else {
      setTimeOfDay(TimeOfDay.NIGHT);
      setBgClass('from-indigo-900/20 to-blue-900/20 via-purple-900/20');
    }
  }, []);
  
  return (
    <motion.div 
      className={`min-h-screen w-full overflow-hidden bg-gradient-to-br ${bgClass} dark:bg-gradient-to-br dark:from-slate-950 dark:to-indigo-950/40 dark:via-slate-900/80`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-primary/5 to-blue-100/20 dark:from-primary/10 dark:to-blue-500/5 blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, 15, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute bottom-[-5%] right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-l from-purple-100/30 to-rose-100/10 dark:from-purple-500/10 dark:to-rose-500/5 blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
