
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface TeamFilterControlsProps {
  periodFilter: '7' | '30' | '90';
  setPeriodFilter: (period: '7' | '30' | '90') => void;
  selectedFilter: string;
  filterUsers: (filter: string) => void;
}

const TeamFilterControls: React.FC<TeamFilterControlsProps> = ({
  periodFilter,
  setPeriodFilter,
  selectedFilter,
  filterUsers
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center mt-4 sm:mt-0">
      <span className="text-sm text-muted-foreground mr-2">Période:</span>
      <div className="flex gap-1">
        <Button
          variant={periodFilter === '7' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodFilter('7')}
          className="rounded-full"
        >
          7j
        </Button>
        <Button
          variant={periodFilter === '30' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodFilter('30')}
          className="rounded-full"
        >
          30j
        </Button>
        <Button
          variant={periodFilter === '90' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodFilter('90')}
          className="rounded-full"
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
        >
          Tous
        </Button>
        <Button
          variant={selectedFilter === 'risk' ? 'default' : 'outline'}
          size="sm"
          onClick={() => filterUsers('risk')}
          className="rounded-full"
        >
          À risque
        </Button>
      </div>
    
      <div className="ml-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TeamFilterControls;
