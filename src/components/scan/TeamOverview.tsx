
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamOverviewProps } from '@/types';

const TeamOverview: React.FC<TeamOverviewProps> = ({ 
  teamId, 
  period = 'week',
  anonymized = false 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue d'équipe émotionnelle</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Visualisation des données émotionnelles d'équipe pour la période: {period}
        </p>
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md mt-4">
          <span className="text-muted-foreground">
            Données de l'équipe {anonymized ? 'anonymisées' : ''} (ID: {teamId})
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
