
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PeriodSelectorProps {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
  disabled?: boolean;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  timePeriod, 
  setTimePeriod,
  disabled = false
}) => {
  return (
    <div className={cn("mt-4 md:mt-0", disabled && "opacity-70")}>
      <Tabs value={timePeriod} onValueChange={setTimePeriod} className="w-[300px]">
        <TabsList className="grid w-full grid-cols-3" disabled={disabled}>
          <TabsTrigger value="7" disabled={disabled}>7 jours</TabsTrigger>
          <TabsTrigger value="30" disabled={disabled}>30 jours</TabsTrigger>
          <TabsTrigger value="90" disabled={disabled}>90 jours</TabsTrigger>
        </TabsList>
      </Tabs>
      {disabled && (
        <div className="text-xs text-muted-foreground mt-1 text-center">
          Mise à jour en cours...
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;
