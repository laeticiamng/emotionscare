// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TeamFilterControlsProps {
  periodFilter: '7' | '30' | '90';
  setPeriodFilter: (period: '7' | '30' | '90') => void;
  selectedFilter: string;
  filterUsers: (filter: string) => void;
  isLoading?: boolean;
}

const TeamFilterControls: React.FC<TeamFilterControlsProps> = ({
  periodFilter,
  setPeriodFilter,
  selectedFilter,
  filterUsers,
  isLoading = false
}) => {
  return (
    <div className={cn(
      "flex flex-wrap gap-2 items-center mt-4 sm:mt-0",
      isLoading && "opacity-70"
    )}>
      <span className="text-sm text-muted-foreground mr-2">Période:</span>
      <div className="flex gap-1">
        <Button
          variant={periodFilter === '7' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodFilter('7')}
          className="rounded-full"
          disabled={isLoading}
        >
          7j
        </Button>
        <Button
          variant={periodFilter === '30' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodFilter('30')}
          className="rounded-full"
          disabled={isLoading}
        >
          30j
        </Button>
        <Button
          variant={periodFilter === '90' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodFilter('90')}
          className="rounded-full"
          disabled={isLoading}
        >
          90j
        </Button>
      </div>
    
      <span className="text-sm text-muted-foreground ml-4 mr-2">Filtrer:</span>
      <div className="flex gap-1">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => filterUsers('all')}
          className="rounded-full"
          disabled={isLoading}
        >
          Tous
        </Button>
        <Button
          variant={selectedFilter === 'risk' ? 'default' : 'outline'}
          size="sm"
          onClick={() => filterUsers('risk')}
          className="rounded-full"
          disabled={isLoading}
        >
          À risque
        </Button>
      </div>
    
      <div className="ml-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          disabled={isLoading}
        >
          <Filter className="h-4 w-4" />
          {isLoading && <span className="sr-only">Chargement en cours</span>}
        </Button>
      </div>
      
      {isLoading && (
        <span className="text-xs text-muted-foreground ml-2 flex items-center">
          <span className="inline-block mr-1 w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
          Mise à jour en cours...
        </span>
      )}
    </div>
  );
};

export default TeamFilterControls;
