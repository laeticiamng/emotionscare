
import React from 'react';
import { motion } from 'framer-motion';
import EmotionalModule from './EmotionalModule';
import MindfulnessModule from './MindfulnessModule';
import ModuleCard from './ModuleCard';
import { Brain, Waves } from 'lucide-react';
import { routes } from '@/routerV2';

interface ModulesSectionProps {
  className?: string;
  style?: React.CSSProperties;
  collapsed?: boolean;
  onToggle?: () => void;
  selectedMood?: string;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({
  className,
  style,
  collapsed = false,
  onToggle,
}) => {
  if (collapsed) {
    return (
      <motion.div 
        className={`${className || ''} cursor-pointer premium-card backdrop-blur-xl p-6 flex justify-between items-center group`}
        onClick={onToggle}
        style={style}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Modules thérapeutiques
        </h3>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          Cliquez pour afficher
        </span>
      </motion.div>
    );
  }

  return (
    <div className={`${className || ''} space-y-8`} style={style}>
      <div className="flex justify-between items-center">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Modules thérapeutiques
        </motion.h3>
        {onToggle && (
          <button 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            onClick={onToggle}
          >
            Masquer
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <EmotionalModule />
        <MindfulnessModule />
        
        {/* Nouveau module de méditation */}
        <ModuleCard
          icon={<Brain className="h-7 w-7" />}
          title="Méditation & Relaxation"
          description="Sessions guidées, exercices de respiration et ambiances sonores pour votre bien-être mental"
          statIcon={<Waves className="h-4 w-4" />}
          statText="Sessions disponibles"
          statValue="50+"
          to={routes.b2c.meditation()}
          gradient="from-indigo-500 via-purple-600 to-violet-700"
        />
      </div>
    </div>
  );
};

export default ModulesSection;
