import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sunset } from 'lucide-react';
import { TIME_OF_DAY, TimeOfDay } from '@/constants/defaults';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function TimeBasedBackground({ children, className = '' }: TimeBasedBackgroundProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(TIME_OF_DAY.MORNING);
  
  useEffect(() => {
    const hour = new Date().getHours();
    
    // Set time of day based on current hour
    if (hour >= 5 && hour < 12) setTimeOfDay(TIME_OF_DAY.MORNING);
    else if (hour >= 12 && hour < 18) setTimeOfDay(TIME_OF_DAY.AFTERNOON);
    else if (hour >= 18 && hour < 22) setTimeOfDay(TIME_OF_DAY.EVENING);
    else setTimeOfDay(TIME_OF_DAY.NIGHT);
  }, []);
  
  // Background colors for different times of day with smooth gradient transitions
  const getBackgroundStyle = () => {
    switch (timeOfDay) {
      case TIME_OF_DAY.MORNING:
        return {
          light: 'from-amber-50 via-sky-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
          accent1: 'bg-amber-100/40 dark:bg-amber-950/20',
          accent2: 'bg-sky-100/40 dark:bg-sky-950/20'
        };
      case TIME_OF_DAY.AFTERNOON:
        return {
          light: 'from-blue-50 via-sky-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900',
          accent1: 'bg-blue-100/40 dark:bg-blue-950/20',
          accent2: 'bg-indigo-100/40 dark:bg-indigo-950/20'
        };
      case TIME_OF_DAY.EVENING:
        return {
          light: 'from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-900',
          accent1: 'bg-violet-100/40 dark:bg-violet-950/20',
          accent2: 'bg-pink-100/40 dark:bg-pink-950/20'
        };
      case TIME_OF_DAY.NIGHT:
        return {
          light: 'from-slate-900 via-blue-950 to-violet-950 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900',
          accent1: 'bg-blue-900/20 dark:bg-blue-950/30',
          accent2: 'bg-violet-900/20 dark:bg-violet-950/30'
        };
      default:
        return {
          light: 'from-blue-50 to-purple-50 dark:from-slate-950 dark:to-slate-900',
          accent1: 'bg-blue-100/40 dark:bg-blue-950/20',
          accent2: 'bg-purple-100/40 dark:bg-purple-950/20'
        };
    }
  };
  
  const bg = getBackgroundStyle();
  
  return (
    <div className={`relative w-full min-h-screen overflow-hidden bg-gradient-to-b ${bg.light} ${className}`}>
      {/* Decorative elements */}
      <motion.div 
        className={`absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-30 ${bg.accent1}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />
      <motion.div 
        className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-30 ${bg.accent2}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
