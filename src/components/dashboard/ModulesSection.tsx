
import React from 'react';
import UserModulesGrid from '@/components/dashboard/UserModulesGrid';

interface ModulesSectionProps {
  className?: string;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ className }) => {
  return (
    <div className={className || ''}>
      <h3 className="text-2xl font-semibold mb-4">Navigation rapide</h3>
      <UserModulesGrid />
    </div>
  );
};

export default ModulesSection;
