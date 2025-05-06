
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartInteractiveLegend } from "@/components/ui/chart";
import { useMediaQuery } from '@/hooks/use-mobile';

interface AbsenteeismChartProps {
  data: Array<{ date: string; value: number }>;
}

const AbsenteeismChart: React.FC<AbsenteeismChartProps> = ({ data }) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleToggleSeries = (dataKey: string, isHidden: boolean) => {
    if (isHidden) {
      setHiddenSeries(hiddenSeries.filter(key => key !== dataKey));
    } else {
      setHiddenSeries([...hiddenSeries, dataKey]);
    }
  };

  return (
    <ChartContainer
      config={{
        value: { 
          theme: { light: '#7ED321', dark: '#7ED321' },
          label: 'Absentéisme' 
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
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
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default AbsenteeismChart;
