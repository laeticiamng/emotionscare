
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserMode } from '@/contexts/UserModeContext';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface UnifiedSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const { userMode } = useUserMode();
  const [collapsed, setCollapsed] = React.useState(false);
  
  // Déterminer la couleur de fond en fonction du mode utilisateur
  const bgColorClass = userMode === 'b2b_admin' 
    ? 'bg-slate-800 text-white' 
    : 'bg-background';
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <>
      {/* Version mobile (visible uniquement sur mobile et quand isOpen est true) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ ease: "easeOut", duration: 0.2 }}
            className={`fixed left-0 top-16 bottom-0 w-64 ${bgColorClass} border-r shadow-lg z-30 md:hidden`}
          >
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="flex-1 py-2 px-3">
                <UnifiedNavigation onItemClick={onToggle} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Version desktop (toujours visible sur desktop) */}
      <div 
        className={`hidden md:block fixed left-0 top-16 bottom-0 border-r shadow-sm z-30 
          ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ${bgColorClass}`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="flex-1 py-2 px-3">
            <UnifiedNavigation collapsed={collapsed} />
          </div>
          <div className="p-3 border-t flex justify-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleCollapse}
              className="h-8 w-8"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
              <span className="sr-only">
                {collapsed ? 'Développer' : 'Réduire'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedSidebar;
