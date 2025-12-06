
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockData = [
  { day: 'Lun', mood: 65, energy: 70 },
  { day: 'Mar', mood: 72, energy: 68 },
  { day: 'Mer', mood: 78, energy: 75 },
  { day: 'Jeu', mood: 82, energy: 80 },
  { day: 'Ven', mood: 75, energy: 72 },
  { day: 'Sam', mood: 88, energy: 85 },
  { day: 'Dim', mood: 85, energy: 82 },
];

export const MoodTrendWidget: React.FC = () => {
  const currentMood = 82;
  const previousMood = 75;
  const trend = currentMood - previousMood;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tendance Émotionnelle</span>
          <div className="flex items-center gap-1 text-sm">
            {trend >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={trend >= 0 ? 'text-green-500' : 'text-red-500'}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name === 'mood' ? 'Humeur' : 'Énergie']}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="mood"
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="energy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
