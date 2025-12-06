
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface PeriodSelectorProps {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  timePeriod,
  setTimePeriod
}) => {
  const periods = [
    { key: '7', label: '7 jours' },
    { key: '30', label: '30 jours' },
    { key: '90', label: '3 mois' }
  ];
  
  return (
    <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-1 mt-4 md:mt-0">
      <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
      {periods.map((period) => (
        <Button
          key={period.key}
          variant={timePeriod === period.key ? "default" : "ghost"}
          size="sm"
          onClick={() => setTimePeriod(period.key)}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

export default PeriodSelector;
