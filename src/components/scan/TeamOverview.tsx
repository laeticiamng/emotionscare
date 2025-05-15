
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamOverviewProps } from '@/types';

const TeamOverview: React.FC<TeamOverviewProps> = ({ teamId, period = 'week', anonymized = true }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Aperçu de l'équipe</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Vue d'ensemble émotionnelle de l'équipe {teamId}</p>
        <p>Période: {period}</p>
        <p>Mode anonyme: {anonymized ? 'Oui' : 'Non'}</p>
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
