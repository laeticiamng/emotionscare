/**
 * AuraTimeFilter - Filtre temporel pour le leaderboard
 */
import { memo } from 'react';
import { Calendar, CalendarDays, Infinity } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type TimeRange = 'week' | 'month' | 'all';

interface AuraTimeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export const AuraTimeFilter = memo(function AuraTimeFilter({
  value,
  onChange,
}: AuraTimeFilterProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as TimeRange)}
      className="bg-muted/50 p-1 rounded-lg"
      aria-label="Période de temps"
    >
      <ToggleGroupItem
        value="week"
        aria-label="Cette semaine"
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
        Semaine
      </ToggleGroupItem>
      <ToggleGroupItem
        value="month"
        aria-label="Ce mois"
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <CalendarDays className="h-4 w-4 mr-2" aria-hidden="true" />
        Mois
      </ToggleGroupItem>
      <ToggleGroupItem
        value="all"
        aria-label="Tout"
        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Infinity className="h-4 w-4 mr-2" aria-hidden="true" />
        Tout
      </ToggleGroupItem>
    </ToggleGroup>
  );
});
