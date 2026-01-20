// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMoodTrendData } from '@/hooks/useMoodTrendData';

export const MoodTrendWidget: React.FC = () => {
  const { data, currentMood, trend, isLoading } = useMoodTrendData(7);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const hasData = data.some(d => d.mood > 0 || d.energy > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tendance Émotionnelle</span>
          {hasData && (
            <div className="flex items-center gap-1 text-sm">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : trend < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-muted-foreground'}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <p>Aucune donnée d'humeur cette semaine</p>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name === 'mood' ? 'Humeur' : 'Énergie']}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="mood"
                  connectNulls
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="energy"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
