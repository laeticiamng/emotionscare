
import React from 'react';

export interface TeamOverviewProps {
  teamId?: string;
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: [Date, Date];
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}

const TeamOverview: React.FC<TeamOverviewProps> = ({
  teamId,
  userId,
  anonymized = false,
  className = '',
  dateRange,
  users = [],
  showNames = false,
  compact = false
}) => {
  // Convertir les valeurs numériques ou objets en ReactNode sécurisé
  const safeValue = (value: any): React.ReactNode => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value.toString();
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className={`team-overview ${className}`}>
      <h2 className="text-xl font-bold">Aperçu de l'équipe</h2>
      {users.length === 0 ? (
        <p className="text-muted-foreground">Aucune donnée disponible</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {users.map((user, index) => (
            <div key={user.id || index} className="p-4 border rounded">
              <h3 className="font-medium">{showNames ? user.name : `Membre #${index + 1}`}</h3>
              <div className="mt-2">
                <div className="text-sm">
                  <span>Score émotionnel: </span>
                  <span className="font-bold">{safeValue(user.emotionalScore || 'N/A')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamOverview;
