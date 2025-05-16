
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartInteractiveLegend } from '@/components/ui/chart';

interface AbsenteeismChartData {
  date: string;
  value: number;
}

interface AbsenteeismChartProps {
  data: AbsenteeismChartData[];
}

const AbsenteeismChart: React.FC<AbsenteeismChartProps> = ({ data }) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

  const toggleSeries = (dataKey: string, isHidden: boolean) => {
    if (isHidden) {
      setHiddenSeries(prev => [...prev, dataKey]);
    } else {
      setHiddenSeries(prev => prev.filter(key => key !== dataKey));
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Taux d'absentéisme</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -25,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
              <Tooltip
                content={(props) => (
                  <ChartTooltip>
                    <ChartTooltipContent 
                      active={props.active} 
                      payload={props.payload} 
                      label={props.label}
                      labelFormatter={(label) => `Date: ${label}`}
                      valueFormatter={(value) => `${value}%`}
                    />
                  </ChartTooltip>
                )}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Absentéisme"
                stroke="var(--primary)"
                dot={true}
                hide={hiddenSeries.includes("value")}
                activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }}
              />
              <ChartInteractiveLegend
                onToggleSeries={toggleSeries}
                hiddenSeries={hiddenSeries}
                verticalAlign="top"
                align="center"
                layout="horizontal"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AbsenteeismChart;
