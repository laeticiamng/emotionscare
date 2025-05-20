
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UnifiedHeader from './UnifiedHeader';
import UnifiedSidebar from './UnifiedSidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

interface UnifiedShellProps {
  children: React.ReactNode;
}

const UnifiedShell: React.FC<UnifiedShellProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { reduceMotion } = useTheme();
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <UnifiedSidebar />
      </div>
      
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: reduceMotion ? "tween" : "spring", duration: reduceMotion ? 0.15 : 0.3 }}
            className="fixed top-0 left-0 bottom-0 z-50 md:hidden"
          >
            <UnifiedSidebar isMobile onClose={() => setIsMobileSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col w-full">
        <UnifiedHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
        
        <main className="flex-1 pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.15 }}
              className="min-h-[calc(100vh-4rem)]"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default UnifiedShell;
