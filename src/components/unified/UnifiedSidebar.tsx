
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const UnifiedSidebar: React.FC = () => {
  const { userMode } = useUserMode();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-16 left-0 bottom-0 z-30",
        "bg-background border-r border-border",
        "flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        isMobile && "transform -translate-x-full"
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        
        {userMode && !collapsed && (
          <div className="mt-1 text-xs text-muted-foreground px-3 mb-4">
            Mode {getUserModeDisplayName(userMode)}
          </div>
        )}
        
        <UnifiedNavigation collapsed={collapsed} />
      </div>
    </motion.div>
  );
};

export default UnifiedSidebar;
