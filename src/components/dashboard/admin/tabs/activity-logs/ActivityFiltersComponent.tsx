
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";

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
  // Créer un état local pour la plage de dates au format DateRange
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: filters.startDate ? new Date(filters.startDate) : undefined,
    to: filters.endDate ? new Date(filters.endDate) : undefined
  });

  // Mettre à jour la plage de dates et appeler handleDateRangeChange
  const handleSetDateRange = (range: DateRange) => {
    setDateRange(range);
    handleDateRangeChange(range);
  };

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
        <DatePickerWithRange date={dateRange} setDate={handleSetDateRange} />
      </div>
    </>
  );
};

export default ActivityFiltersComponent;
