
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ProductivityChartProps {
  data: Array<{ date: string; value: number }>;
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
  return (
    <ChartContainer
      config={{
        value: { theme: { light: '#4A90E2', dark: '#4A90E2' } },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="wellnessBlueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A90E2" stopOpacity={1}/>
              <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.7}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar 
            dataKey="value" 
            name="value"
            fill="url(#wellnessBlueGradient)" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ProductivityChart;
