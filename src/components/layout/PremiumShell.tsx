
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import PremiumHeader from './PremiumHeader';
import PremiumFooter from './PremiumFooter';
import { cn } from '@/lib/utils';

interface PremiumShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  immersive?: boolean;
  contentClassName?: string;
  className?: string;
}

/**
 * Premium shell component with modern animations and responsive design
 */
const PremiumShell: React.FC<PremiumShellProps> = ({ 
  children, 
  hideNav = false,
  hideFooter = false,
  immersive = false,
  contentClassName = "",
  className = ""
}) => {
  const { theme, reduceMotion } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useIsMobile();
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state for header effects
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Calculate scroll progress for progress bar
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = height ? Math.min(window.scrollY / height, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-background transition-colors duration-300", 
      className, 
      theme
    )}>
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-transform duration-200 ease-in-out origin-left"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
      
      {/* Background Gradient */}
      <div className={cn(
        "fixed inset-0 -z-10 pointer-events-none transition-opacity duration-500",
        theme === 'light' 
          ? 'bg-gradient-to-b from-blue-50/50 to-white' 
          : theme === 'dark' 
            ? 'bg-gradient-to-b from-gray-900 to-black/80' 
            : 'bg-gradient-to-b from-blue-100/50 to-blue-50/30'
      )} />

      {/* Floating decorative elements for immersive mode */}
      {immersive && !reduceMotion && (
        <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute rounded-full",
                  theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                )}
                style={{
                  width: Math.random() * 8 + 4,
                  height: Math.random() * 8 + 4,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      {!hideNav && (
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            scrolled
              ? 'bg-background/80 backdrop-blur-lg shadow-sm'
              : 'bg-transparent'
          )}
        >
          <PremiumHeader scrolled={scrolled} />
        </motion.header>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 relative",
        contentClassName
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!hideFooter && (
        <motion.footer
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <PremiumFooter />
        </motion.footer>
      )}
      
      {/* Command palette (Cmd+K) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div id="command-palette-container"></div>
      </div>
    </div>
  );
};

export default PremiumShell;
