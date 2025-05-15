
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamOverviewProps } from '@/types';

const TeamOverview: React.FC<TeamOverviewProps> = ({ 
  teamId, 
  period = 'week',
  loading = false
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vue d'ensemble de l'équipe</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Données de l'équipe {teamId} pour la période: {period}</p>
            <p className="text-muted-foreground mt-2">
              Cette fonctionnalité est en cours de développement.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
