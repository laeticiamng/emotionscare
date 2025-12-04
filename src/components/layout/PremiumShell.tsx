// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/providers/theme';
import CommandMenu from '@/components/layout/CommandMenu';
import NotificationToast from '@/components/layout/NotificationToast';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { cn } from '@/lib/utils';

interface PremiumShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

const PremiumShell: React.FC<PremiumShellProps> = ({
  children,
  header,
  footer,
  sidebar,
  className
}) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const { resolvedTheme } = useTheme();
  const location = useLocation();
  const isDarkMode = resolvedTheme === 'dark';

  // SSR-safe reduced motion detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);
  
  // Track command+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command+K or Ctrl+K to open command menu
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
      
      // Escape to close sidebar on mobile
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col w-full relative",
      isDarkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900",
      className
    )}>
      {/* Progress Indicator */}
      <ScrollProgress
        color={isDarkMode ? "primary" : "blue-500"}
        height={3}
      />
      
      {/* Header */}
      {header}
      
      {/* Main Content with Sidebar */}
      <main className="flex-1 flex flex-col md:flex-row w-full pt-16">
        {/* Sidebar for larger screens */}
        {sidebar && (
          <AnimatePresence>
            <div className="hidden md:block">
              {sidebar}
            </div>
          </AnimatePresence>
        )}
        
        {/* Sidebar Overlay for Mobile */}
        {sidebar && isSidebarOpen && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          </AnimatePresence>
        )}
        
        {/* Mobile Sidebar */}
        {sidebar && (
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ 
                  type: reduceMotion ? "tween" : "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: reduceMotion ? 0.1 : undefined
                }}
                className="fixed top-0 left-0 h-screen z-50 md:hidden"
              >
                {sidebar}
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {/* Main Content Area */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="sync">{/* Fixed multiple children warning */}
            <motion.div
              key={location.pathname}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              className="flex-1 w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Footer */}
      {footer}
      
      {/* Command Menu */}
      <CommandMenu 
        open={isCommandOpen} 
        onOpenChange={setIsCommandOpen} 
      />
      
      {/* Toast Notifications */}
      <NotificationToast />
    </div>
  );
};

export default PremiumShell;
