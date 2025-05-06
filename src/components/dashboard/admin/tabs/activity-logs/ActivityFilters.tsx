
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { ActivityFiltersState } from './types';

interface ActivityFiltersProps {
  filters: ActivityFiltersState;
  onFilterChange: (key: keyof ActivityFiltersState, value: any) => void;
  onReset: () => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({ 
  filters, 
  onFilterChange,
  onReset
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Input
        placeholder="Rechercher par type d'activité..."
        value={filters.searchTerm}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        className="flex-1"
      />
      
      <Select 
        value={filters.activityType} 
        onValueChange={(value) => onFilterChange('activityType', value)}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Type d'activité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="connexion">Connexion</SelectItem>
          <SelectItem value="consultation">Consultation</SelectItem>
          <SelectItem value="inscription_event">Inscription</SelectItem>
          <SelectItem value="modification_profil">Modification profil</SelectItem>
          <SelectItem value="questionnaire_reponse">Questionnaire</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex gap-2">
        <DatePicker
          date={filters.startDate}
          onSelect={(date) => onFilterChange('startDate', date)}
          placeholder="Date début"
        />
        <DatePicker
          date={filters.endDate}
          onSelect={(date) => onFilterChange('endDate', date)}
          placeholder="Date fin"
        />
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onReset}
      >
        <Filter className="h-4 w-4 mr-2" />
        Réinitialiser
      </Button>
    </div>
  );
};

export default ActivityFilters;
