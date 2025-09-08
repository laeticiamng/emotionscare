import React from 'react';
import { Loader2, Heart, Brain, Music } from 'lucide-react';
import { motion } from 'framer-motion';

interface PremiumLoadingFallbackProps {
  message?: string;
  showIcons?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const PremiumLoadingFallback: React.FC<PremiumLoadingFallbackProps> = ({
  message = "Chargement de votre expérience premium...",
  showIcons = true,
  size = 'md',
  fullScreen = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center' 
    : 'flex items-center justify-center p-8';

  const icons = [Heart, Brain, Music];

  return (
    <div className={`${containerClasses} bg-background`}>
      <div className="text-center space-y-6">
        {/* Main Loading Spinner */}
        <div className="relative">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mx-auto`} />
          
          {/* Floating Icons Animation */}
          {showIcons && (
            <div className="absolute inset-0 flex items-center justify-center">
              {icons.map((Icon, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  animate={{
                    x: [0, 20 * Math.cos(index * 2.1), 0],
                    y: [0, 20 * Math.sin(index * 2.1), 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className={`${sizeClasses.sm} text-primary/40`} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <motion.p 
            className="text-sm text-muted-foreground font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {message}
          </motion.p>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Brand Gradient Bar */}
        <div className="w-32 h-1 mx-auto bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};