
import React from 'react';
import { motion } from 'framer-motion';
import ModuleCard from '@/components/home/ModuleCard';

interface Module {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  statIcon: React.ReactNode;
  statText: string;
  statValue: string | number;
  priority: number;
}

interface MoodBasedModulesProps {
  modules: Module[];
  selectedMood: string | null;
}

const MoodBasedModules: React.FC<MoodBasedModulesProps> = ({ 
  modules = [], 
  selectedMood 
}) => {
  // Ensure modules is always an array
  const safeModules = Array.isArray(modules) ? modules : [];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeModules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ModuleCard
              title={module.title}
              description={module.description}
              icon={module.icon}
              to={module.to}
              statIcon={module.statIcon}
              statText={module.statText}
              statValue={module.statValue}
            />
          </motion.div>
        ))}
      </div>
      
      {selectedMood && (
        <motion.div 
          className="mt-6 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Modules recommandés selon votre humeur actuelle: <span className="font-medium text-primary">{selectedMood}</span>
        </motion.div>
      )}
    </>
  );
};

export default MoodBasedModules;
