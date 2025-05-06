
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartInteractiveLegend } from "@/components/ui/chart";
import { ZoomableChart } from '@/components/ui/chart/ZoomableChart';
import { useMediaQuery } from '@/hooks/use-media-query';

interface AbsenteeismChartProps {
  data: Array<{ date: string; value: number }>;
}

const AbsenteeismChart: React.FC<AbsenteeismChartProps> = ({ data }) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Enrich data with previous values for delta calculation
  const enrichedData = data.map((point, idx) => ({
    ...point,
    previousValue: idx > 0 ? data[idx - 1].value : null
  }));

  const handleToggleSeries = (dataKey: string, isHidden: boolean) => {
    if (isHidden) {
      setHiddenSeries(hiddenSeries.filter(key => key !== dataKey));
    } else {
      setHiddenSeries([...hiddenSeries, dataKey]);
    }
  };

  const chartConfig = {
    value: { 
      theme: { light: '#7ED321', dark: '#7ED321' },
      label: 'Absentéisme' 
    },
  };

  return (
    <ZoomableChart data={enrichedData} config={chartConfig}>
      <AreaChart margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="wellnessGreenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7ED321" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#7ED321" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartInteractiveLegend
          onToggleSeries={handleToggleSeries}
          hiddenSeries={hiddenSeries}
          verticalAlign={isMobile ? "bottom" : "top"}
          align="right"
          layout={isMobile ? "vertical" : "horizontal"}
        />
        {!hiddenSeries.includes('value') && (
          <Area 
            type="monotone" 
            dataKey="value" 
            name="Absentéisme"
            stroke="#7ED321" 
            fill="url(#wellnessGreenGradient)" 
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        )}
      </AreaChart>
    </ZoomableChart>
  );
};

export default AbsenteeismChart;
