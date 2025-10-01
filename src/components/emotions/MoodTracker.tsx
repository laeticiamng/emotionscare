// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MoodEntry {
  date: string;
  mood: number;
  emotion: string;
  note?: string;
}

interface MoodTrackerProps {
  data: MoodEntry[];
  className?: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ data, className }) => {
  const calculateTrend = () => {
    if (data.length < 2) return 0;
    const recent = data.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(7, data.length);
    const previous = data.slice(-14, -7).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(7, data.length - 7);
    return recent - previous;
  };

  const trend = calculateTrend();
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Suivi de l'humeur
          </div>
          <Badge variant={trend > 0 ? "default" : trend < 0 ? "destructive" : "secondary"}>
            {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis domain={[1, 10]} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p>Humeur: {data.mood}/10</p>
                        <p>Émotion: {data.emotion}</p>
                        {data.note && <p className="text-sm text-muted-foreground">{data.note}</p>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
