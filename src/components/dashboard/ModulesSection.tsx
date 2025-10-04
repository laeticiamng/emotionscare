// @ts-nocheck

import React from 'react';
import UserModulesGrid from '@/components/dashboard/UserModulesGrid';

interface ModulesSectionProps {
  className?: string;
  style?: React.CSSProperties;
  collapsed?: boolean;
  onToggle?: () => void;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ 
  className, 
  style, 
  collapsed = false,
  onToggle
}) => {
  if (collapsed) {
    return (
      <div 
        className={`${className || ''} cursor-pointer bg-muted/70 rounded-xl p-4 flex justify-between items-center`}
        onClick={onToggle}
        style={style}
      >
        <h3 className="text-xl font-semibold">Navigation rapide</h3>
        <span className="text-sm text-muted-foreground">Cliquez pour afficher</span>
      </div>
    );
  }

  return (
    <div className={className || ''} style={style}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Navigation rapide</h3>
        {onToggle && (
          <button 
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={onToggle}
          >
            Masquer
          </button>
        )}
      </div>
      <UserModulesGrid />
    </div>
  );
};

export default ModulesSection;
