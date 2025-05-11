
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ModulesHeader from '@/components/home/modules/ModulesHeader';
import MoodBasedModules from '@/components/home/modules/MoodBasedModules';
import { useModulePrioritization } from '@/components/home/modules/useModulePrioritization';

interface ModulesSectionProps {
  showHeading?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  selectedMood?: string | null;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({
  showHeading = false,
  collapsed = false,
  onToggle,
  selectedMood
}) => {
  const { isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsCollapsed(prev => !prev);
    }
  };
  
  const prioritizedModules = useModulePrioritization(isAuthenticated, selectedMood);
  
  return (
    <section className="bg-card rounded-2xl p-6 shadow-sm">
      <ModulesHeader 
        showHeading={showHeading}
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
      />
      
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <MoodBasedModules 
              modules={prioritizedModules}
              selectedMood={selectedMood || null}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ModulesSection;
