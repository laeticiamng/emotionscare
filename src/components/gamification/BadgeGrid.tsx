
import React from 'react';
import { Badge as BadgeType } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeGridProps {
  badges: BadgeType[];
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p>Vous n'avez pas encore de badge.</p>
        <p className="text-sm mt-1">Participez à des activités pour en gagner!</p>
      </div>
    );
  }

  // Group badges by type if available
  const groupedBadges: Record<string, BadgeType[]> = {};
  
  badges.forEach(badge => {
    const type = badge.type || 'other';
    if (!groupedBadges[type]) {
      groupedBadges[type] = [];
    }
    groupedBadges[type].push(badge);
  });

  const badgeTypes = Object.keys(groupedBadges);

  return (
    <div className="space-y-6">
      {badgeTypes.length > 1 ? (
        badgeTypes.map(type => (
          <div key={type} className="space-y-2">
            <h3 className="text-lg font-medium capitalize">{type}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {groupedBadges[type].map(renderBadge)}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {badges.map(renderBadge)}
        </div>
      )}
    </div>
  );
};

const renderBadge = (badge: BadgeType) => {
  const isLocked = badge.id.includes('locked') || badge.name.includes('Locked');
  const badgeImage = badge.image_url || badge.imageUrl || badge.image;
  
  return (
    <TooltipProvider key={badge.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={isLocked ? 'opacity-50' : ''}>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                {isLocked ? (
                  <Lock className="h-6 w-6 text-muted-foreground" />
                ) : badge.icon ? (
                  <span className="text-2xl">{badge.icon}</span>
                ) : badgeImage ? (
                  <img
                    src={badgeImage}
                    alt={badge.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <Award className="h-6 w-6 text-primary" />
                )}
              </div>
              <h3 className="text-sm font-medium line-clamp-2">
                {badge.name}
              </h3>
              {badge.level && (
                <span className="text-xs text-muted-foreground">
                  Niveau {badge.level}
                </span>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-medium">{badge.name}</p>
          <p className="text-xs">{badge.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeGrid;
