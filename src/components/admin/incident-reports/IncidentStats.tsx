import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Incident } from './types';

interface IncidentStatsProps {
  incidents?: Incident[];
}

export const IncidentStats: React.FC<IncidentStatsProps> = ({ incidents }) => {
  const totalIncidents = incidents?.length || 0;
  const openIncidents = incidents?.filter(i => i.status === 'open').length || 0;
  const investigatingIncidents = incidents?.filter(i => i.status === 'investigating').length || 0;
  const resolvedIncidents = incidents?.filter(i => i.status === 'resolved' || i.status === 'closed').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalIncidents}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Ouverts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {openIncidents}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>En Investigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {investigatingIncidents}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Résolus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            {resolvedIncidents}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
