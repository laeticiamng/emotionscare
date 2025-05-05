
import React from 'react';
import UserModulesGrid from '@/components/dashboard/UserModulesGrid';

interface ModulesSectionProps {
  className?: string;
  style?: React.CSSProperties;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ className, style }) => {
  return (
    <div className={className || ''} style={style}>
      <h3 className="text-2xl font-semibold mb-4">Navigation rapide</h3>
      <UserModulesGrid />
    </div>
  );
};

export default ModulesSection;
