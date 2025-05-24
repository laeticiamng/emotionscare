
import React from 'react';
import EmotionalModule from './EmotionalModule';
import MindfulnessModule from './MindfulnessModule';
import ModuleCard from './ModuleCard';
import { Brain, Heart, Waves } from 'lucide-react';

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
  selectedMood
}) => {
  if (collapsed) {
    return (
      <div 
        className={`${className || ''} cursor-pointer bg-gray-50/70 dark:bg-gray-800/20 rounded-xl p-4 flex justify-between items-center`}
        onClick={onToggle}
        style={style}
      >
        <h3 className="text-xl font-semibold">Modules thérapeutiques</h3>
        <span className="text-sm text-muted-foreground">Cliquez pour afficher</span>
      </div>
    );
  }

  return (
    <div className={`${className || ''} space-y-6`} style={style}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Modules thérapeutiques</h3>
        {onToggle && (
          <button 
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={onToggle}
          >
            Masquer
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <EmotionalModule />
        <MindfulnessModule />
        
        {/* Nouveau module de méditation */}
        <ModuleCard
          icon={<Brain className="h-6 w-6" />}
          title="Méditation & Relaxation"
          description="Sessions guidées, exercices de respiration et ambiances sonores pour votre bien-être mental"
          statIcon={<Waves className="h-4 w-4" />}
          statText="Sessions disponibles"
          statValue="50+"
          to="/meditation"
        />
      </div>
    </div>
  );
};

export default ModulesSection;
