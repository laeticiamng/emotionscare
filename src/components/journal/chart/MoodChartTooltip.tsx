
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';

interface MoodChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const MoodChartTooltip: React.FC<MoodChartTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card className="p-3 shadow-lg border bg-white">
        <p className="font-semibold">{format(data.originalDate, 'EEEE dd MMMM', { locale: fr })}</p>
        <div className="text-sm mt-1">
          <p className="text-blue-600">Sentiment: {payload[0].value}/100</p>
          <p className="text-red-500">Anxiété: {payload[1].value}/100</p>
          <p className="text-green-600">Énergie: {payload[2].value}/100</p>
        </div>
      </Card>
    );
  }
  return null;
};

export default MoodChartTooltip;
