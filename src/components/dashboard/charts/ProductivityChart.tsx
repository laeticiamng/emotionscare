
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartTooltip } from '@/components/ui/chart/ChartTooltip';
import { ChartTooltipContent } from '@/components/ui/chart/ChartTooltipContent';
import { ChartInteractiveLegend } from '@/components/ui/chart/ChartInteractiveLegend';

interface ProductivityChartProps {
  className?: string;
  data?: Array<{ date: string; value: number }>;
}

const defaultData = [
  { date: '01/01', series1: 400, series2: 240 },
  { date: '01/08', series1: 300, series2: 139 },
  { date: '01/15', series1: 200, series2: 980 },
  { date: '01/22', series1: 278, series2: 390 },
  { date: '01/29', series1: 189, series2: 480 },
  { date: '02/05', series1: 239, series2: 380 },
  { date: '02/12', series1: 349, series2: 430 },
];

const CustomTooltip: React.FC = () => {
  return (
    <ChartTooltipContent />
  );
};

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ className, data }) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const handleToggleSeries = (dataKey: string, isHidden: boolean) => {
    setHiddenSeries(prev => isHidden ? [...prev, dataKey] : prev.filter(key => key !== dataKey));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Productivité</CardTitle>
        <CardDescription>Aperçu de la productivité hebdomadaire</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data || defaultData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            
            <ChartTooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="series1"
              stroke="#8884d8"
              fill="#8884d8"
              name="Série 1"
              hide={hiddenSeries.includes('series1')}
            />
            <Area
              type="monotone"
              dataKey="series2"
              stroke="#82ca9d"
              fill="#82ca9d"
              name="Série 2"
              hide={hiddenSeries.includes('series2')}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <ChartInteractiveLegend 
          onToggleSeries={handleToggleSeries} 
          hiddenSeries={hiddenSeries} 
          verticalAlign="bottom"
          align="center"
          layout="horizontal"
        />
      </CardContent>
    </Card>
  );
};

export default ProductivityChart;
