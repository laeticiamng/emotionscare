import React from 'react';
import { motion } from 'framer-motion';
import AuthBackdrop from '@/components/auth/AuthBackdrop';
import { ModeToggle } from '@/components/ui/mode-toggle';

interface B2CAuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundImage?: string;
}

const B2CAuthLayout: React.FC<B2CAuthLayoutProps> = ({
  title,
  subtitle,
  children,
  backgroundImage,
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Graphics */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-950 dark:to-purple-900 relative overflow-hidden"
      >
        <AuthBackdrop imageUrl={backgroundImage} variant="consumer" />
        
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg text-white/80 max-w-md"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-background">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        
        <div className="max-w-md w-full">
          <div className="md:hidden mb-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-2"
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-muted-foreground"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default B2CAuthLayout;
