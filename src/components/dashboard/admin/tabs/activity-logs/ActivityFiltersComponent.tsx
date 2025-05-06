
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";

interface ActivityFiltersComponentProps {
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

const ActivityFiltersComponent: React.FC<ActivityFiltersComponentProps> = ({
  filters,
  setFilters,
  handleDateRangeChange
}) => {
  return (
    <>
      <div className="mt-4">
        <Label>Rechercher</Label>
        <Input
          type="search"
          placeholder="Rechercher par type d'activité"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
      </div>
      <div className="mt-4">
        <Label>Type d'activité</Label>
        <Select onValueChange={(value) => setFilters({ ...filters, activityType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les types</SelectItem>
            <SelectItem value="login">Connexion</SelectItem>
            <SelectItem value="scan_emotion">Scan émotionnel</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4">
        <Label>Période</Label>
        <DatePickerWithRange onDateChange={handleDateRangeChange} />
      </div>
    </>
  );
};

export default ActivityFiltersComponent;
