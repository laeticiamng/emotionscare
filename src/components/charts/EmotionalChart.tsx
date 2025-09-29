
import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface EmotionalData {
  date: string;
  happiness: number;
  stress: number;
  energy: number;
  focus: number;
}

interface EmotionalChartProps {
  data: EmotionalData[];
  type?: 'line' | 'area' | 'pie';
  height?: number;
  showTrend?: boolean;
}

const EmotionalChart: React.FC<EmotionalChartProps> = ({
  data,
  type = 'line',
  height = 300,
  showTrend = true
}) => {
  const colors = {
    happiness: '#10B981',
    stress: '#EF4444',
    energy: '#F59E0B',
    focus: '#3B82F6'
  };

  const calculateTrend = (key: keyof EmotionalData) => {
    if (data.length < 2) return 0;
    const first = data[0][key] as number;
    const last = data[data.length - 1][key] as number;
    return ((last - first) / first) * 100;
  };

  const pieData = data.length > 0 ? [
    { name: 'Bonheur', value: data[data.length - 1].happiness, color: colors.happiness },
    { name: 'Stress', value: data[data.length - 1].stress, color: colors.stress },
    { name: 'Énergie', value: data[data.length - 1].energy, color: colors.energy },
    { name: 'Focus', value: data[data.length - 1].focus, color: colors.focus }
  ] : [];

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="happiness" stackId="1" stroke={colors.happiness} fill={colors.happiness} fillOpacity={0.6} />
            <Area type="monotone" dataKey="energy" stackId="1" stroke={colors.energy} fill={colors.energy} fillOpacity={0.6} />
            <Area type="monotone" dataKey="focus" stackId="1" stroke={colors.focus} fill={colors.focus} fillOpacity={0.6} />
          </AreaChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="happiness" stroke={colors.happiness} strokeWidth={2} />
            <Line type="monotone" dataKey="stress" stroke={colors.stress} strokeWidth={2} />
            <Line type="monotone" dataKey="energy" stroke={colors.energy} strokeWidth={2} />
            <Line type="monotone" dataKey="focus" stroke={colors.focus} strokeWidth={2} />
          </LineChart>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          État Émotionnel
          {showTrend && data.length > 1 && (
            <div className="flex gap-2">
              {(['happiness', 'stress', 'energy', 'focus'] as const).map(key => {
                const trend = calculateTrend(key);
                return (
                  <Badge key={key} variant={trend > 0 ? 'default' : 'secondary'} className="text-xs">
                    {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(trend).toFixed(1)}%
                  </Badge>
                );
              })}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalChart;
