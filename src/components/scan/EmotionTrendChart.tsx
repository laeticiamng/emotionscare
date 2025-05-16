
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Legend } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// Sample data for the chart
const emotionData = [
  { date: '01/05', joy: 60, calm: 40, focus: 30, energy: 10, anxiety: 15 },
  { date: '02/05', joy: 55, calm: 45, focus: 35, energy: 15, anxiety: 20 },
  { date: '03/05', joy: 45, calm: 50, focus: 40, energy: 20, anxiety: 25 },
  { date: '04/05', joy: 40, calm: 60, focus: 45, energy: 30, anxiety: 20 },
  { date: '05/05', joy: 50, calm: 55, focus: 50, energy: 35, anxiety: 15 },
  { date: '06/05', joy: 60, calm: 50, focus: 45, energy: 30, anxiety: 10 },
  { date: '07/05', joy: 65, calm: 45, focus: 40, energy: 25, anxiety: 5 },
];

interface EmotionTrendChartProps {
  title?: string;
  description?: string;
  data?: any[];
  height?: number;
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({
  title = "Tendances Émotionnelles",
  description = "Évolution de vos émotions ces 7 derniers jours",
  data = emotionData,
  height = 300
}) => {
  const [timeRange, setTimeRange] = useState('week');
  
  // Colors for the emotions
  const emotionColors = {
    joy: '#F59E0B',     // Amber
    calm: '#3B82F6',    // Blue
    focus: '#10B981',   // Emerald
    energy: '#EF4444',  // Red
    anxiety: '#6366F1'  // Indigo
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry, index) => (
              <div key={`item-${index}`} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs capitalize">{entry.name}: </span>
                <span className="text-xs font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">24 heures</SelectItem>
            <SelectItem value="week">7 jours</SelectItem>
            <SelectItem value="month">30 jours</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12 }}
              domain={[0, 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 15 }}
              formatter={(value) => <span className="capitalize">{value}</span>}
            />
            <Area 
              type="monotone" 
              dataKey="joy" 
              name="Joie"
              stroke={emotionColors.joy} 
              fill={emotionColors.joy} 
              fillOpacity={0.2} 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="calm" 
              name="Calme"
              stroke={emotionColors.calm} 
              fill={emotionColors.calm} 
              fillOpacity={0.2} 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="focus" 
              name="Concentration"
              stroke={emotionColors.focus} 
              fill={emotionColors.focus} 
              fillOpacity={0.2} 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="energy" 
              name="Énergie"
              stroke={emotionColors.energy} 
              fill={emotionColors.energy} 
              fillOpacity={0.2} 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="anxiety" 
              name="Anxiété"
              stroke={emotionColors.anxiety} 
              fill={emotionColors.anxiety} 
              fillOpacity={0.2} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmotionTrendChart;
