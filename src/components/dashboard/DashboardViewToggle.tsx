
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LayoutGrid } from 'lucide-react';

interface DashboardViewToggleProps {
  minimalView: boolean;
  onToggle: () => void;
}

const DashboardViewToggle: React.FC<DashboardViewToggleProps> = ({ 
  minimalView, 
  onToggle 
}) => {
  return (
    <Button 
      variant="outline" 
      className="ml-auto focus-premium btn-premium"
      onClick={onToggle}
    >
      {minimalView ? (
        <>
          <LayoutDashboard size={18} />
          <span className="ml-2">Vue Complète</span>
        </>
      ) : (
        <>
          <LayoutGrid size={18} />
          <span className="ml-2">Vue Minimaliste</span>
        </>
      )}
    </Button>
  );
};

export default DashboardViewToggle;
