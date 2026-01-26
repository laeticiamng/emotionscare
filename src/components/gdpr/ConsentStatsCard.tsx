import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { ConsentStats } from '@/hooks/useGDPRMonitoring';

interface ConsentStatsCardProps {
  stats: ConsentStats | null;
  isLoading: boolean;
}

const COLORS = {
  analytics: 'hsl(var(--primary))',
  functional: 'hsl(var(--secondary))',
};

const ConsentStatsCard: React.FC<ConsentStatsCardProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-8">
          <p className="text-muted-foreground text-center">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  const pieData = [
    { name: 'Analytics acceptés', value: stats.analyticsConsents },
    { name: 'Analytics refusés', value: stats.totalConsents - stats.analyticsConsents },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Répartition des consentements</CardTitle>
          <CardDescription>
            Taux d'acceptation: {stats.consentRate.toFixed(1)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {pieData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? COLORS.analytics : COLORS.functional}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalConsents}</p>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Analytics</p>
              <p className="text-2xl font-bold text-primary">{stats.analyticsConsents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Évolution des consentements</CardTitle>
          <CardDescription>Consentements accordés sur les 7 derniers jours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="analytics"
                stroke={COLORS.analytics}
                strokeWidth={2}
                name="Analytics"
              />
              <Line
                type="monotone"
                dataKey="functional"
                stroke={COLORS.functional}
                strokeWidth={2}
                name="Fonctionnel"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentStatsCard;
