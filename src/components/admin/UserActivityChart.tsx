// @ts-nocheck
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const UserActivityChart: React.FC = () => {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['user_activity_chart'],
    queryFn: async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data, error } = await supabase
        .from('mood_entries')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString());

      if (error) throw error;

      // Group by month
      const counts: Record<string, number> = {};
      (data ?? []).forEach((entry: any) => {
        const date = new Date(entry.created_at);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        counts[key] = (counts[key] || 0) + 1;
      });

      // Build last 6 months data
      const result = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        result.push({
          month: MONTH_LABELS[d.getMonth()],
          users: counts[key] || 0,
        });
      }
      return result;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
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
