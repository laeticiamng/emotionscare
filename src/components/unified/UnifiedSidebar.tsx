
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';

const UnifiedSidebar: React.FC = () => {
  const { userMode } = useUserMode();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-16 left-0 bottom-0 w-64",
        "bg-background border-r border-border z-30",
        "flex flex-col"
      )}
    >
      <div className="py-4 px-4">
        <div className="px-3 py-2 mb-2">
          <h2 className="text-xl font-semibold flex items-center">
            EmotionsCare
          </h2>
          {userMode && (
            <div className="mt-1 text-xs text-muted-foreground">
              Mode {getUserModeDisplayName(userMode)}
            </div>
          )}
        </div>
        <UnifiedNavigation />
      </div>
    </motion.div>
  );
};

export default UnifiedSidebar;
