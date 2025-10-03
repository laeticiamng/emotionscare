
import React, { useState, useEffect } from 'react';
import UnifiedHeader from './UnifiedHeader';
import UnifiedSidebar from './UnifiedSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedShellProps {
  children: React.ReactNode;
}

const UnifiedShell: React.FC<UnifiedShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Vérifier si l'appareil est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Fermer la sidebar si on clique à l'extérieur sur mobile
  const handleMainClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader onMenuClick={toggleSidebar} />
      
      <div className="relative pt-16 flex">
        <UnifiedSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-20"
              onClick={handleMainClick}
            />
          )}
        </AnimatePresence>
        
        <motion.main 
          className="flex-1 ml-0 md:ml-64 p-4"
          onClick={handleMainClick}
        >
          {children}
        </motion.main>
      </div>
      
      {isMobile && (
        <Button
          onClick={toggleSidebar}
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 h-12 w-12"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default UnifiedShell;
