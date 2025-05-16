
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JournalEntry } from '@/types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subDays, parseISO } from 'date-fns';

export interface JournalMoodChartProps {
  entries: JournalEntry[];
  className?: string;
}

const JournalMoodChart: React.FC<JournalMoodChartProps> = ({ entries, className }) => {
  const [timeRange, setTimeRange] = useState('7days');
  
  // Process entries for chart data
  const processEntries = () => {
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
    
    // Get mood score from entries
    const chartData = sortedEntries.map(entry => {
      let moodScore = 50;
      if (typeof entry.mood_score === 'number') {
        moodScore = entry.mood_score;
      } else if (entry.mood) {
        // Map string moods to scores if needed
        switch (entry.mood.toLowerCase()) {
          case 'happy': moodScore = 80; break;
          case 'sad': moodScore = 20; break;
          case 'angry': moodScore = 10; break;
          case 'calm': moodScore = 60; break;
          case 'anxious': moodScore = 30; break;
          default: moodScore = 50;
        }
      }
      
      return {
        date: typeof entry.date === 'string' ? entry.date : format(entry.date, 'yyyy-MM-dd'),
        value: moodScore,
        mood: entry.mood,
        id: entry.id
      };
    });
    
    // Filter by time range
    const now = new Date();
    let filterDate;
    switch (timeRange) {
      case '7days':
        filterDate = subDays(now, 7);
        break;
      case '30days':
        filterDate = subDays(now, 30);
        break;
      case '90days':
        filterDate = subDays(now, 90);
        break;
      default:
        filterDate = subDays(now, 7);
    }
    
    return chartData.filter(entry => {
      const entryDate = parseISO(entry.date);
      return entryDate >= filterDate;
    });
  };
  
  const chartData = processEntries();
  
  // Get mood color based on value
  const getMoodColor = (value: number) => {
    if (value >= 80) return '#22c55e';
    if (value >= 60) return '#84cc16';
    if (value >= 40) return '#eab308';
    if (value >= 20) return '#f97316';
    return '#ef4444';
  };
  
  // Custom tooltip
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-sm">{format(parseISO(data.date), 'dd MMM yyyy')}</p>
          <p className="text-sm font-medium">{data.mood || 'Mood'}: {data.value}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Tendances d'humeur</CardTitle>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 jours</SelectItem>
            <SelectItem value="30days">30 jours</SelectItem>
            <SelectItem value="90days">90 jours</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), 'dd/MM')}
                  stroke="#888"
                  fontSize={12}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  stroke="#888"
                  fontSize={12}
                />
                <Tooltip content={renderTooltip} />
                <ReferenceLine y={50} stroke="#888" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, stroke: "#3b82f6", fill: "white" }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Pas assez d'entrées pour afficher un graphique</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalMoodChart;
