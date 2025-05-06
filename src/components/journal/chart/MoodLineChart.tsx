
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartInteractiveLegend } from '@/components/ui/chart';
import type { MoodData } from '@/types';
import MoodChartTooltip from './MoodChartTooltip';
import { useMediaQuery } from '@/hooks/use-media-query';

interface MoodLineChartProps {
  data: MoodData[];
}

const MoodLineChart: React.FC<MoodLineChartProps> = ({ data }) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Enrich data with previous values for delta calculation
  const enrichedData = data.map((point, idx) => ({
    ...point,
    previousSentiment: idx > 0 ? data[idx - 1].sentiment : null,
    previousAnxiety: idx > 0 ? data[idx - 1].anxiety : null,
    previousEnergy: idx > 0 ? data[idx - 1].energy : null
  }));

  const handleToggleSeries = (dataKey: string, isHidden: boolean) => {
    if (isHidden) {
      setHiddenSeries(hiddenSeries.filter(key => key !== dataKey));
    } else {
      setHiddenSeries([...hiddenSeries, dataKey]);
    }
  };

  return (
    <div className="h-80">
      <ChartContainer 
        config={{
          sentiment: { 
            color: '#4A90E2',
            label: 'Sentiment' 
          },
          anxiety: { 
            color: '#E53E3E',
            label: 'Anxiété' 
          },
          energy: { 
            color: '#38A169',
            label: 'Énergie' 
          }
        }}
      >
        <LineChart
          data={enrichedData}
          margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip content={<MoodChartTooltip />} />
          <ChartInteractiveLegend
            onToggleSeries={handleToggleSeries}
            hiddenSeries={hiddenSeries}
            verticalAlign={isMobile ? "bottom" : "top"}
            align="right"
            layout={isMobile ? "vertical" : "horizontal"}
          />
          {!hiddenSeries.includes('sentiment') && (
            <Line 
              type="monotone" 
              dataKey="sentiment" 
              name="Sentiment" 
              stroke="#4A90E2" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          )}
          {!hiddenSeries.includes('anxiety') && (
            <Line 
              type="monotone" 
              dataKey="anxiety" 
              name="Anxiété" 
              stroke="#E53E3E" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          )}
          {!hiddenSeries.includes('energy') && (
            <Line 
              type="monotone" 
              dataKey="energy" 
              name="Énergie" 
              stroke="#38A169" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          )}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default MoodLineChart;
