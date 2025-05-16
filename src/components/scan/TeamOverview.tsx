
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamOverviewProps } from '@/types/emotions';

const TeamOverview: React.FC<TeamOverviewProps> = ({
  userId,
  period,
  anonymized,
  className,
  dateRange,
  users,
  showNames,
  compact
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Vue d'équipe</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Cette fonctionnalité montre l'état émotionnel global de l'équipe.</p>
        {users && users.length > 0 ? (
          <div className="mt-4">
            <p>{users.length} membres dans l'équipe</p>
            <p>Période: {period || 'Cette semaine'}</p>
            <p>Mode anonymisé: {anonymized ? 'Oui' : 'Non'}</p>
          </div>
        ) : (
          <p className="mt-4">Aucune donnée disponible pour l'équipe.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
