
import React from 'react';
import { TeamOverviewProps } from '@/types';

const TeamOverview: React.FC<TeamOverviewProps> = ({
  teamId,
  userId,
  period = 'week',
  anonymized = false,
  className = '',
  dateRange,
  users = [],
  showNames = true,
  compact = false
}) => {
  return (
    <div className={`team-overview ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Vue d'équipe {compact && "(compacte)"}</h2>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <div key={user.id} className="bg-card p-4 rounded-lg shadow">
              {showNames ? (
                <div className="font-medium">{user.name}</div>
              ) : (
                <div className="font-medium">Utilisateur {user.anonymity_code || "anonyme"}</div>
              )}
              <div className="text-sm text-muted-foreground">{user.role}</div>
              <div className="mt-2">
                <div className="text-sm">Score émotionnel: {user.emotional_score || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Aucun utilisateur trouvé pour cette équipe.</p>
      )}
    </div>
  );
};

export default TeamOverview;
