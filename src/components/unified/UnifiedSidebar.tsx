
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnifiedSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({ isOpen, onToggle }) => {
  const { userMode } = useUserMode();
  const [collapsed, setCollapsed] = useState(false);
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
  
  const handleToggleCollapsed = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };
  
  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={isMobile ? "hidden" : false}
        animate={isMobile ? (isOpen ? "visible" : "hidden") : false}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed top-16 left-0 bottom-0 z-30",
          "bg-background border-r border-border",
          "flex flex-col transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          !isMobile && "md:translate-x-0"
        )}
      >
        <div className="py-4 px-4 flex-1 overflow-y-auto">
          <div className={cn(
            "px-3 py-2 mb-2 flex items-center justify-between",
            collapsed && "justify-center px-1"
          )}>
            {!collapsed && (
              <h2 className="text-xl font-semibold">
                EmotionsCare
              </h2>
            )}
            {isMobile ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggle}
                className="ml-auto"
              >
                <X size={16} />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleCollapsed}
                className="ml-auto"
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Button>
            )}
          </div>
          
          {userMode && !collapsed && (
            <div className="mt-1 text-xs text-muted-foreground px-3 mb-4">
              Mode {getUserModeDisplayName(userMode)}
            </div>
          )}
          
          <UnifiedNavigation collapsed={collapsed} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UnifiedSidebar;
