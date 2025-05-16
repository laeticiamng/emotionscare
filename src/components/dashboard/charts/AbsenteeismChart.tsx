import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart/ChartTooltipContent';
import { ChartInteractiveLegend } from '@/components/ui/chart/ChartInteractiveLegend';
import { ChartTooltip } from '@/components/ui/chart';

interface AbsenteeismChartProps {
  data: { date: string; absences: number; presence: number; productivity: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  return (
    <ChartTooltipContent
      active={active}
      payload={payload}
      label={label}
      valueFormatter={(value) => `${value}`}
      labelFormatter={(label) => label}
    />
  );
};

export const AbsenteeismChart: React.FC<AbsenteeismChartProps> = ({ data }) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const handleToggleSeries = (dataKey: string, isHidden: boolean) => {
    setHiddenSeries(isHidden
      ? [...hiddenSeries, dataKey]
      : hiddenSeries.filter(key => key !== dataKey)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taux d'absentéisme</CardTitle>
        <CardDescription>Visualisation des absences et de la productivité</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="absences"
              stroke="#8884d8"
              fill="#8884d8"
              name="Absences"
              hide={hiddenSeries.includes('absences')}
            />
            <Area
              type="monotone"
              dataKey="presence"
              stroke="#82ca9d"
              fill="#82ca9d"
              name="Présence"
              hide={hiddenSeries.includes('presence')}
            />
            <Area
              type="monotone"
              dataKey="productivity"
              stroke="#ffc658"
              fill="#ffc658"
              name="Productivité"
              hide={hiddenSeries.includes('productivity')}
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
