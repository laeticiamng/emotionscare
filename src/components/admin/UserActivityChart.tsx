// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityData {
  month: string;
  users: number;
}

const UserActivityChart: React.FC = () => {
  const [chartData, setChartData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');

        // Get activity counts per month for the last 6 months
        const { data: activityData } = await supabase
          .from('activity_logs')
          .select('created_at, user_id')
          .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: true });

        if (activityData && activityData.length > 0) {
          const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
          const monthCounts: Record<string, Set<string>> = {};

          activityData.forEach(a => {
            const date = new Date(a.created_at);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!monthCounts[monthKey]) monthCounts[monthKey] = new Set();
            monthCounts[monthKey].add(a.user_id);
          });

          const sortedMonths = Object.keys(monthCounts).sort();
          const formattedData = sortedMonths.slice(-6).map(key => {
            const [year, monthIdx] = key.split('-');
            return {
              month: months[parseInt(monthIdx)],
              users: monthCounts[key].size
            };
          });

          setChartData(formattedData);
        } else {
          // Fallback
          setChartData([
            { month: 'Jan', users: 0 },
            { month: 'Fév', users: 0 },
            { month: 'Mar', users: 0 },
          ]);
        }
      } catch (error) {
        console.error('Error loading activity chart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivityData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Chargement...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { UserActivityChart };
export default UserActivityChart;
