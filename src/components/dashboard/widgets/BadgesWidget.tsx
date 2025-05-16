
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/types/gamification';
import { normalizeBadges } from '@/utils/badgeUtils';

interface BadgesWidgetProps {
  badges: Badge[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  className?: string;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({
  badges,
  title = "Badges récents",
  showSeeAll = false,
  onSeeAll,
  className,
}) => {
  const normalizedBadges = normalizeBadges(badges);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {showSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm font-medium text-primary hover:underline"
          >
            Voir tout
          </button>
        )}
      </CardHeader>
      <CardContent>
        {normalizedBadges.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {normalizedBadges.slice(0, 6).map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                  {badge.imageUrl ? (
                    <img 
                      src={badge.imageUrl} 
                      alt={badge.name} 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                  ) : (
                    <div className="text-lg font-bold text-primary">
                      {badge.name.substring(0, 1)}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium line-clamp-1">{badge.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucun badge disponible</p>
            <p className="text-sm mt-1">Complétez des défis pour gagner des badges</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesWidget;
