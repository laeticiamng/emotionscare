
import React from 'react';

export interface TeamOverviewProps {
  teamId: string;
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: [Date, Date];
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
  period?: string;
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
  // Properly handle any value type and convert to safe React node
  const safeValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      return value.toString();
    }
    
    // Handle objects properly
    if (typeof value === 'object') {
      // For objects with title and description properties
      if ('title' in value && typeof value.title === 'string') {
        return value.title;
      }
      
      // For objects with emotionName property
      if ('emotionName' in value && typeof value.emotionName === 'string') {
        return value.emotionName;
      }
      
      // For objects with name property
      if ('name' in value && typeof value.name === 'string') {
        return value.name;
      }
      
      // Convert object to string representation safely
      try {
        return JSON.stringify(value);
      } catch (e) {
        return 'Complex object';
      }
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
              <h3 className="font-medium">{showNames ? safeValue(user.name) : `Membre #${index + 1}`}</h3>
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
