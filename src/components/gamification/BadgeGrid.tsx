
import React from 'react';
import { Badge as BadgeType } from '@/types/gamification';
import BadgeCard from './BadgeCard';

interface BadgeGridProps {
  badges: BadgeType[];
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
        const progress = progressFunction(badge.threshold);
        
        return (
          <BadgeCard
            key={badge.id}
            name={badge.name}
            description={badge.description}
            iconUrl={badge.icon_url}
            isEarned={isEarned}
            progress={progress}
            threshold={badge.threshold}
          />
        );
      })}
    </div>
  );
};

export default BadgeGrid;
