import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/providers/theme';
import EnhancedHeader from './EnhancedHeader';
import EnhancedFooter from './EnhancedFooter';
import CommandMenu from './CommandMenu';
import NotificationToast from './NotificationToast';
import MainNavigationHub from '@/components/navigation/MainNavigationHub';
import SkipLinks from './SkipLinks';
import { InAppNotificationCenter } from '@/components/InAppNotificationCenter';
import { cn } from '@/lib/utils';

interface EnhancedShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  immersive?: boolean;
  className?: string;
}

const EnhancedShell: React.FC<EnhancedShellProps> = ({
  children,
  hideNav = false,
  hideFooter = false,
  immersive = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  
  // Compute derived theme properties
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Handling scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state for header effects
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Calculate scroll progress
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = height ? Math.min(window.scrollY / height, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command+K to open command menu
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandMenuOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-background transition-colors duration-300",
      className
    )} data-testid="page-root">
      {/* Skip Links pour accessibilité */}
      <SkipLinks />
      
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-transform duration-200 ease-in-out origin-left"
        style={{ transform: `scaleX(${scrollProgress})` }}
        role="progressbar"
        aria-label="Progression de la page"
        aria-valuenow={Math.round(scrollProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Background Gradient Effects */}
      <div className={cn(
        "fixed inset-0 -z-10 pointer-events-none transition-opacity duration-500",
        isDarkMode 
          ? 'bg-gradient-to-b from-gray-900 to-black/80' 
          : 'bg-gradient-to-b from-blue-50/50 to-white'
      )} />

      {/* Decorative Background Elements */}
      {immersive && !reduceMotion && (
        <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute rounded-full",
                  isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
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
        <header id="main-navigation" role="banner">
          <EnhancedHeader scrolled={scrolled} />
        </header>
      )}

      {/* Main Content */}
      <main id="main-content" role="main" className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 relative mt-16">
        <AnimatePresence mode="sync">{/* Fixed multiple children warning */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="w-full"
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!hideFooter && <EnhancedFooter />}

      {/* Command Menu (Cmd+K) */}
      <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      
      {/* Floating Notification Container */}
      <NotificationToast />
      
      {/* Navigation Hub */}
      <MainNavigationHub />
      
      {/* In-App Notification Center */}
      <InAppNotificationCenter />
    </div>
  );
};

export default EnhancedShell;