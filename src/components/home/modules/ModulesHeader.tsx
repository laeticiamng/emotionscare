
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModulesHeaderProps {
  showHeading: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}

const ModulesHeader: React.FC<ModulesHeaderProps> = ({ showHeading, isCollapsed, onToggle }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      {showHeading ? (
        <h2 className="text-2xl font-semibold">Nos modules</h2>
      ) : (
        <h2 className="text-xl font-semibold">Modules recommandés</h2>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onToggle} 
        className="h-9 w-9 p-0"
      >
        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </Button>
    </div>
  );
};

export default ModulesHeader;
