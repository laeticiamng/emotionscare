
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamOverviewProps } from '@/types/scan';

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
        <CardTitle>Aperçu de l'équipe</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Implement the team overview visualization based on props */}
        <p>Période: {period || 'Semaine'}</p>
        {users && users.length > 0 ? (
          <div>
            {users.map((user, index) => (
              <div key={user.id || index} className="mb-2">
                {showNames ? user.name : `Membre ${index + 1}`}: {user.emotionalScore || 'N/A'}
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune donnée d'équipe disponible</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
