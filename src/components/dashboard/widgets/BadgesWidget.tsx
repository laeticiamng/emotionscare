
import React from 'react';
import { Badge } from '@/types/gamification';

interface BadgesWidgetProps {
  badges: Badge[];
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ badges }) => {
  return (
    <div className="space-y-3">
      {badges.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucun badge débloqué pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                {badge.icon}
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium">{badge.name}</p>
                <div className="text-xs text-muted-foreground truncate">{badge.description}</div>
                
                {badge.progress !== undefined && badge.progress < 100 && (
                  <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-1 rounded-full" 
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgesWidget;
