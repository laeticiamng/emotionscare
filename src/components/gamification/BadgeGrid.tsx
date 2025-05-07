
import React from 'react';
import { Badge } from '@/types';
import BadgeCard from './BadgeCard';

interface BadgeGridProps {
  badges: Badge[];
  earnedBadgeIds: string[];
  progressFunction: (threshold: number) => number;
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ 
  badges, 
  earnedBadgeIds, 
  progressFunction 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((badge) => {
        const isEarned = earnedBadgeIds.includes(badge.id);
        const threshold = badge.threshold || 100;
        const progress = progressFunction(threshold);
        
        return (
          <BadgeCard
            key={badge.id}
            name={badge.name}
            description={badge.description}
            iconUrl={badge.icon_url || badge.image_url}
            isEarned={isEarned}
            progress={progress}
            threshold={threshold}
          />
        );
      })}
      
      {badges.length === 0 && (
        <p className="col-span-full text-center py-4 text-muted-foreground">
          Aucun badge disponible actuellement
        </p>
      )}
    </div>
  );
};

export default BadgeGrid;
