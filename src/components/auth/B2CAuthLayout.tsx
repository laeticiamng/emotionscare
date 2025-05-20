
import React from 'react';
import { motion } from 'framer-motion';
import ThemeButton from '@/components/theme/ThemeButton';

interface B2CAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

const B2CAuthLayout: React.FC<B2CAuthLayoutProps> = ({
  children,
  title,
  subtitle,
  backgroundImage
}) => {
  // Determine time of day for adaptive background
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };
  
  const timeOfDay = getTimeOfDay();
  
  // Tailwind classes for background based on time of day
  const getTimeBasedBackground = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30';
      case 'afternoon':
        return 'from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-sky-900/30';
      case 'evening':
        return 'from-orange-50 to-purple-50 dark:from-orange-900/30 dark:to-purple-900/30';
      case 'night':
        return 'from-gray-900 to-indigo-900 dark:from-gray-900 dark:to-indigo-950';
      default:
        return 'from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30';
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-gradient-to-br ${getTimeBasedBackground()}`}>
      {/* Left side - decorative */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ 
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' 
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-primary/5"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-10 z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass-card p-8 rounded-2xl max-w-md"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              EmotionsCare
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-md mx-auto">
              Votre compagnon quotidien pour un bien-être émotionnel optimal
            </p>
          </motion.div>
          
          {/* Ambient decorative elements */}
          <div className="ambient-circle w-64 h-64 bg-blue-300/30 dark:bg-blue-800/30 absolute top-10 -left-20 animate-blob"></div>
          <div className="ambient-circle w-96 h-96 bg-purple-300/20 dark:bg-purple-800/20 absolute bottom-10 -right-20 animate-blob animation-delay-2000"></div>
        </div>
      </motion.div>
      
      {/* Right side - form container */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                {title}
              </h2>
              <p className="text-muted-foreground mt-2">{subtitle}</p>
            </div>
            <ThemeButton />
          </div>
          
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default B2CAuthLayout;
