
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PeriodSelectorProps {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ timePeriod, setTimePeriod }) => {
  return (
    <div className="mt-4 md:mt-0">
      <Tabs value={timePeriod} onValueChange={setTimePeriod} className="w-[300px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="7">7 jours</TabsTrigger>
          <TabsTrigger value="30">30 jours</TabsTrigger>
          <TabsTrigger value="90">90 jours</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default PeriodSelector;
