
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import type { MoodData } from '@/types';
import MoodChartTooltip from './MoodChartTooltip';
import { useMediaQuery } from '@/hooks/use-media-query';

interface MoodLineChartProps {
  data: MoodData[];
  showControls: boolean;
}

// Adding types for ZoomableChart
interface ZoomableChartProps {
  children: React.ReactNode;
  showControls?: boolean;
}

// Adding types for ChartInteractiveLegend
interface ChartInteractiveLegendProps {
  onToggleSeries: (dataKey: string, isHidden: boolean) => void;
  hiddenSeries: string[];
  verticalAlign?: "top" | "middle" | "bottom";
  align?: "left" | "center" | "right";
  layout?: "horizontal" | "vertical";
}

const ZoomableChart: React.FC<ZoomableChartProps> = ({ children, showControls }) => {
  return <div className="h-full w-full">{children}</div>;
};

const ChartInteractiveLegend: React.FC<ChartInteractiveLegendProps> = ({ 
  onToggleSeries, 
  hiddenSeries, 
  verticalAlign = "top", 
  align = "right", 
  layout = "horizontal" 
}) => {
  const chartConfig = {
    sentiment: { color: '#4A90E2', label: 'Sentiment' },
    anxiety: { color: '#E53E3E', label: 'Anxiété' },
    energy: { color: '#38A169', label: 'Énergie' }
  };
  
  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-2 p-2`}>
      {Object.entries(chartConfig).map(([key, config]) => (
        <div 
          key={key} 
          className={`flex items-center gap-1 cursor-pointer ${hiddenSeries.includes(key) ? 'opacity-50' : ''}`}
          onClick={() => onToggleSeries(key, !hiddenSeries.includes(key))}
        >
          <div style={{ backgroundColor: config.color }} className="w-3 h-3 rounded-full" />
          <span className="text-xs">{config.label}</span>
        </div>
      ))}
    </div>
  );
};

const MoodLineChart: React.FC<MoodLineChartProps> = ({ data, showControls }) => {
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
      <ZoomableChart showControls={showControls}>
        <LineChart
          data={data}
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
      </ZoomableChart>
    </div>
  );
};

export default MoodLineChart;
