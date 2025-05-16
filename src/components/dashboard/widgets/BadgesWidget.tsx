
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/types/badge';

export interface BadgesWidgetProps {
  badges: Badge[];
  onSeeAll?: () => void;
  showSeeAll?: boolean;
  className?: string;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ 
  badges,
  onSeeAll,
  showSeeAll = true,
  className
}) => {
  // Get only unlocked badges
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  
  // Display only first 3 unlocked badges
  const displayBadges = unlockedBadges.slice(0, 3);
  
  // Show the "and X more" text if there are more than 3 unlocked badges
  const hasMoreBadges = unlockedBadges.length > 3;
  const moreBadgesCount = unlockedBadges.length - 3;
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Vos badges récents</CardTitle>
        {showSeeAll && onSeeAll && (
          <Button variant="ghost" size="sm" className="text-sm" onClick={onSeeAll}>
            Voir tout
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {unlockedBadges.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Vous n'avez pas encore débloqué de badges.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {displayBadges.map((badge) => (
              <div 
                key={badge.id} 
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                  <img 
                    src={badge.icon} 
                    alt={badge.name} 
                    className="w-8 h-8" 
                    onError={(e) => {
                      e.currentTarget.src = '/placeholders/badge-placeholder.svg';
                    }}
                  />
                </div>
                <div className="text-xs font-medium">{badge.name}</div>
              </div>
            ))}
          </div>
        )}
        
        {hasMoreBadges && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-2 text-muted-foreground" 
            onClick={onSeeAll}
          >
            Et {moreBadgesCount} de plus...
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesWidget;
