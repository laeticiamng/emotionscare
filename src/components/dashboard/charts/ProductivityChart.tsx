// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ProductivityChartProps {
  data?: Array<any>;
  className?: string;
}

const defaultData = [
  { date: '01/01', productivity: 75, focus: 65, satisfaction: 80 },
  { date: '01/08', productivity: 70, focus: 62, satisfaction: 75 },
  { date: '01/15', productivity: 80, focus: 75, satisfaction: 85 },
  { date: '01/22', productivity: 85, focus: 80, satisfaction: 90 },
  { date: '01/29', productivity: 82, focus: 78, satisfaction: 88 },
  { date: '02/05', productivity: 88, focus: 82, satisfaction: 85 },
  { date: '02/12', productivity: 90, focus: 85, satisfaction: 92 },
];

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ data = defaultData, className }) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [visibleMetrics, setVisibleMetrics] = useState({
    productivity: true,
    focus: true,
    satisfaction: true,
  });

  const toggleMetric = (metric: keyof typeof visibleMetrics) => {
    setVisibleMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Productivité</CardTitle>
            <CardDescription>Évolution de la productivité et satisfaction</CardDescription>
          </div>
          <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as 'line' | 'area')}>
            <ToggleGroupItem value="line" aria-label="Afficher en ligne">Ligne</ToggleGroupItem>
            <ToggleGroupItem value="area" aria-label="Afficher en aire">Aire</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-2 py-1 text-xs rounded ${visibleMetrics.productivity ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => toggleMetric('productivity')}
          >
            Productivité
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${visibleMetrics.focus ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => toggleMetric('focus')}
          >
            Concentration
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${visibleMetrics.satisfaction ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}
            onClick={() => toggleMetric('satisfaction')}
          >
            Satisfaction
          </button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {visibleMetrics.productivity && (
                <Line type="monotone" dataKey="productivity" stroke="hsl(var(--primary))" name="Productivité" />
              )}
              {visibleMetrics.focus && (
                <Line type="monotone" dataKey="focus" stroke="hsl(var(--success))" name="Concentration" />
              )}
              {visibleMetrics.satisfaction && (
                <Line type="monotone" dataKey="satisfaction" stroke="hsl(var(--accent))" name="Satisfaction" />
              )}
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {visibleMetrics.productivity && (
                <Area type="monotone" dataKey="productivity" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.5)" name="Productivité" hide={!visibleMetrics.productivity} />
              )}
              {visibleMetrics.focus && (
                <Area type="monotone" dataKey="focus" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.5)" name="Concentration" hide={!visibleMetrics.focus} />
              )}
              {visibleMetrics.satisfaction && (
                <Area type="monotone" dataKey="satisfaction" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.5)" name="Satisfaction" hide={!visibleMetrics.satisfaction} />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProductivityChart;
