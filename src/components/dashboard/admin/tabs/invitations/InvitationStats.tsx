
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvitationStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CircularProgress } from '@/components/ui/circular-progress';

interface InvitationStatsProps {
  stats: InvitationStats;
}

const InvitationStatsDisplay: React.FC<InvitationStatsProps> = ({ stats }) => {
  // Calculate percentage of each status
  const total = stats.total || 1; // Avoid division by zero
  const pendingPercentage = Math.round((stats.pending / total) * 100);
  const acceptedPercentage = Math.round((stats.accepted / total) * 100);
  const expiredPercentage = Math.round((stats.expired / total) * 100);
  const rejectedPercentage = Math.round((stats.rejected / total) * 100);
  const sentPercentage = Math.round((stats.sent / total) * 100);

  // Chart data
  const chartData = [
    { name: 'En attente', value: stats.pending },
    { name: 'Acceptées', value: stats.accepted },
    { name: 'Expirées', value: stats.expired },
    { name: 'Rejetées', value: stats.rejected },
    { name: 'Envoyées', value: stats.sent || 0 }
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Statistiques des invitations</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col justify-center items-center">
            <CircularProgress
              value={stats.accepted}
              max={total}
              size={120}
              className="text-primary"
              showValue={false}
            />
            <div className="mt-2 text-center">
              <p className="text-2xl font-semibold">{acceptedPercentage}%</p>
              <p className="text-sm text-muted-foreground">Taux d&apos;acceptation</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col items-center bg-card/50 p-3 rounded">
              <span className="text-lg font-semibold">{stats.total}</span>
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="flex flex-col items-center bg-card/50 p-3 rounded">
              <span className="text-lg font-semibold text-amber-500">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">En attente</span>
            </div>
            <div className="flex flex-col items-center bg-card/50 p-3 rounded">
              <span className="text-lg font-semibold text-green-500">{stats.accepted}</span>
              <span className="text-xs text-muted-foreground">Acceptées</span>
            </div>
            <div className="flex flex-col items-center bg-card/50 p-3 rounded">
              <span className="text-lg font-semibold text-red-500">{stats.expired}</span>
              <span className="text-xs text-muted-foreground">Expirées</span>
            </div>
          </div>
        </div>

        <div className="h-60 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="name" fontSize={12} tick={{ fill: '#888888' }} />
              <YAxis fontSize={12} tick={{ fill: '#888888' }} />
              <Tooltip />
              <Bar dataKey="value" name="Nombre" fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationStatsDisplay;
