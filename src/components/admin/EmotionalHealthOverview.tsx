import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface HealthData {
  name: string;
  value: number;
  color: string;
}

const defaultData: HealthData[] = [
  { name: 'Excellent', value: 0, color: 'hsl(var(--chart-1))' },
  { name: 'Bon', value: 0, color: 'hsl(var(--chart-2))' },
  { name: 'Moyen', value: 0, color: 'hsl(var(--chart-3))' },
  { name: 'Risque', value: 0, color: 'hsl(var(--chart-4))' },
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const EmotionalHealthOverview: React.FC = () => {
  const [data, setData] = useState<HealthData[]>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        // Récupérer les mood_entries des 7 derniers jours
        const { data: moods, error } = await supabase
          .from('mood_entries')
          .select('score, user_id')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (error) throw error;

        if (moods && moods.length > 0) {
          // Grouper par utilisateur et calculer moyenne
          const userScores: Record<string, number[]> = {};
          moods.forEach((m: any) => {
            if (!userScores[m.user_id]) userScores[m.user_id] = [];
            userScores[m.user_id].push(m.score);
          });

          let excellent = 0, bon = 0, moyen = 0, risque = 0;
          
          Object.values(userScores).forEach(scores => {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            if (avg >= 75) excellent++;
            else if (avg >= 50) bon++;
            else if (avg >= 25) moyen++;
            else risque++;
          });

          const total = excellent + bon + moyen + risque;
          if (total > 0) {
            setData([
              { name: 'Excellent', value: excellent, color: 'hsl(var(--chart-1))' },
              { name: 'Bon', value: bon, color: 'hsl(var(--chart-2))' },
              { name: 'Moyen', value: moyen, color: 'hsl(var(--chart-3))' },
              { name: 'Risque', value: risque, color: 'hsl(var(--chart-4))' },
            ]);
          }
        }
      } catch (error) {
        logger.error('Failed to fetch health data', error as Error, 'ADMIN');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  const hasData = data.some(d => d.value > 0);

  if (isLoading) {
    return (
      <div className="h-[220px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="h-[220px] flex items-center justify-center text-muted-foreground">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.filter(d => d.value > 0)}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.filter(d => d.value > 0).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} utilisateur${Number(value) > 1 ? 's' : ''}`, '']}
            contentStyle={{ 
              background: 'hsl(var(--background))', 
              border: '1px solid hsl(var(--border))' 
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { EmotionalHealthOverview };
export default EmotionalHealthOverview;
