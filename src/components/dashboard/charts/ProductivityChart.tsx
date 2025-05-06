
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartInteractiveLegend } from "@/components/ui/chart";
import { useMediaQuery } from '@/hooks/use-media-query';

interface ProductivityChartProps {
  data: Array<{ date: string; value: number }>;
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
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

  return (
    <ChartContainer
      config={{
        value: { 
          theme: { light: '#4A90E2', dark: '#4A90E2' },
          label: 'Productivité'
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={enrichedData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
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
          <ChartInteractiveLegend
            onToggleSeries={handleToggleSeries}
            hiddenSeries={hiddenSeries}
            verticalAlign={isMobile ? "bottom" : "top"}
            align="right"
            layout={isMobile ? "vertical" : "horizontal"}
          />
          {!hiddenSeries.includes('value') && (
            <Bar 
              dataKey="value" 
              name="Productivité"
              fill="url(#wellnessBlueGradient)" 
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ProductivityChart;
