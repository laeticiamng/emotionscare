
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ChartTimeToggleProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

const ChartTimeToggle: React.FC<ChartTimeToggleProps> = ({ 
  timeRange, 
  setTimeRange 
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={timeRange} 
      onValueChange={(value) => value && setTimeRange(value)} 
      aria-label="Période"
      className="border rounded-full p-1"
    >
      <ToggleGroupItem 
        value="7j" 
        aria-label="7 jours"
        className="rounded-full text-xs data-[state=on]:bg-cocoon-100 data-[state=on]:text-cocoon-800"
      >
        7j
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="30j" 
        aria-label="30 jours"
        className="rounded-full text-xs data-[state=on]:bg-cocoon-100 data-[state=on]:text-cocoon-800"
      >
        30j
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="90j" 
        aria-label="90 jours"
        className="rounded-full text-xs data-[state=on]:bg-cocoon-100 data-[state=on]:text-cocoon-800"
      >
        90j
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ChartTimeToggle;
