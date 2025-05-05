
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AbsenteeismChartProps {
  data: Array<{ date: string; value: number }>;
}

const AbsenteeismChart: React.FC<AbsenteeismChartProps> = ({ data }) => {
  return (
    <ChartContainer
      config={{
        value: { theme: { light: '#7ED321', dark: '#7ED321' } },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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
          <Area 
            type="monotone" 
            dataKey="value" 
            name="value"
            stroke="#7ED321" 
            fill="url(#wellnessGreenGradient)" 
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default AbsenteeismChart;
