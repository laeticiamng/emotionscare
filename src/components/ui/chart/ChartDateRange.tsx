import React from 'react';

interface ChartDateRangeProps {
  startDate: string;
  endDate: string;
}

export const ChartDateRange: React.FC<ChartDateRangeProps> = ({ startDate, endDate }) => {
  if (!startDate || !endDate) return null;

  return (
    <div className="text-xs text-center text-muted-foreground mt-2">
      Plage affichée : {startDate} - {endDate}
    </div>
  );
}
