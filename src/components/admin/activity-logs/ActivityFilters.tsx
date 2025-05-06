
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";

interface ActivityFiltersProps {
  filters: {
    searchTerm: string;
    activityType: string;
    startDate: string;
    endDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    searchTerm: string;
    activityType: string;
    startDate: string;
    endDate: string;
  }>>;
  handleDateRangeChange: (range: { from?: Date; to?: Date }) => void;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filters,
  setFilters,
  handleDateRangeChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Rechercher</Label>
        <Input
          type="search"
          placeholder="Rechercher par type d'activité"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label>Type d'activité</Label>
        <Select 
          value={filters.activityType}
          onValueChange={(value) => setFilters({ ...filters, activityType: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="login">Connexion</SelectItem>
            <SelectItem value="scan_emotion">Scan émotionnel</SelectItem>
            <SelectItem value="journal_entry">Journal</SelectItem>
            <SelectItem value="vr_session">Session VR</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Période</Label>
        <div className="mt-1">
          <DatePickerWithRange onDateChange={handleDateRangeChange} />
        </div>
      </div>
    </div>
  );
};

export default ActivityFilters;
