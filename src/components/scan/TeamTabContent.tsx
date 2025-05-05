
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TeamOverview from '@/components/scan/TeamOverview';
import TeamFilterControls from '@/components/scan/TeamFilterControls';
import TeamStatCards from '@/components/scan/TeamStatCards';
import AISuggestions from '@/components/scan/AISuggestions';
import { User } from '@/types';

interface TeamTabContentProps {
  filteredUsers: User[];
  selectedFilter: string;
  filterUsers: (filter: string) => void;
  periodFilter: '7' | '30' | '90';
  setPeriodFilter: (period: '7' | '30' | '90') => void;
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({
  filteredUsers,
  selectedFilter,
  filterUsers,
  periodFilter,
  setPeriodFilter
}) => {
  return (
    <Card className="p-6 shadow-md rounded-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <h3 className="text-xl font-semibold">Scans Émotionnels de l'Équipe</h3>
        <TeamFilterControls 
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
          selectedFilter={selectedFilter}
          filterUsers={filterUsers}
        />
      </div>
      
      <Separator className="my-6" />
      
      <TeamStatCards />
      
      <TeamOverview users={filteredUsers} />

      <AISuggestions />
    </Card>
  );
};

export default TeamTabContent;
