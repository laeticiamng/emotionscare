
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
  
  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-${timeOfDay}`}>
      {/* Left side - decorative */}
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ 
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor: 'var(--background)'
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-primary/5"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">EmotionsCare</h1>
            <p className="text-xl max-w-md mx-auto">
              Votre compagnon quotidien pour un bien-être émotionnel optimal
            </p>
          </motion.div>
          
          {/* Ambient decorative elements */}
          <div className="ambient-circle w-64 h-64 bg-blue-300/30 dark:bg-blue-800/30 top-10 -left-20 animate-pulse-subtle"></div>
          <div className="ambient-circle w-96 h-96 bg-purple-300/20 dark:bg-purple-800/20 bottom-10 -right-20 animate-pulse-subtle"></div>
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
              <h2 className="text-3xl font-bold">{title}</h2>
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
