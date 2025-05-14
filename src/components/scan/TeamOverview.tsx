
import React from 'react';
import { TeamOverviewProps } from '@/types/types';

const TeamOverview: React.FC<TeamOverviewProps> = ({ 
  users, 
  onUserClick,
  period = 'week',
  dateRange,
  onRefresh,
  userId,
  teamId,
  className = ''
}) => {
  return (
    <div className={className}>
      <h2>Aperçu de l'équipe</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="p-4 border rounded-md cursor-pointer hover:bg-accent/10"
            onClick={() => onUserClick && onUserClick(user.id!)}
          >
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.position || user.job_title || 'Membre de l\'équipe'}</p>
          </div>
        ))}
        
        {users.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">
            Aucun membre d'équipe trouvé.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamOverview;
