
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { ActivityTabView } from './types';

interface ActionBarProps {
  activeTab: ActivityTabView;
  hasData: boolean;
  isLoading: boolean;
  onExport: () => void;
  totalCount: number;
}

const ActionBar: React.FC<ActionBarProps> = ({
  activeTab,
  hasData,
  isLoading,
  onExport,
  totalCount
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {activeTab === 'daily' ? (
          <>
            {totalCount} activité{totalCount !== 1 ? 's' : ''} anonymisée{totalCount !== 1 ? 's' : ''}
          </>
        ) : (
          <>
            {totalCount} type{totalCount !== 1 ? 's' : ''} d'activité
          </>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onExport}
        disabled={!hasData || isLoading}
      >
        <Download className="h-4 w-4 mr-2" />
        Exporter
      </Button>
    </div>
  );
};

export default ActionBar;
