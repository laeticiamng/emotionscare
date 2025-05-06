
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ActivityTabView, ActivityFiltersState } from "./types";

interface ActionBarProps {
  activeTab: ActivityTabView;
  hasData: boolean;
  isLoading: boolean;
  onExport: () => void;
  totalCount: number;
  filters?: ActivityFiltersState;
  setFilters?: React.Dispatch<React.SetStateAction<ActivityFiltersState>>;
}

const ActionBar: React.FC<ActionBarProps> = ({ 
  activeTab, 
  hasData, 
  isLoading, 
  onExport,
  totalCount,
  filters,
  setFilters
}) => {
  return (
    <div className="flex items-center justify-between mt-4 mb-2">
      <div>
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {hasData 
              ? `${totalCount} ${activeTab === 'daily' ? 'activités' : 'types d\'activités'} trouvés` 
              : 'Aucun résultat trouvé'}
          </p>
        )}
      </div>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isLoading || !hasData}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter en CSV
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
