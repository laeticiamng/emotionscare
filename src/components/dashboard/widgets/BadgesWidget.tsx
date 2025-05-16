
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/types/gamification';
import { getBadgeRarityColor } from '@/utils/gamificationUtils';

interface BadgesWidgetProps {
  badges: Badge[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

const BadgesWidget = ({ badges, title = "Badges", showSeeAll = true, onSeeAll }: BadgesWidgetProps) => {
  // Sort badges: first unlocked, then by progress
  const sortedBadges = [...badges].sort((a, b) => {
    // Prioritize badges with unlockedAt property
    if (a.unlockedAt && !b.unlockedAt) return -1;
    if (!a.unlockedAt && b.unlockedAt) return 1;
    
    // If both are in same completion state, sort by progress (higher first)
    if (a.progress && b.progress) {
      return b.progress - a.progress;
    }
    
    // Default sort by name
    return a.name.localeCompare(b.name);
  });
  
  // Get display image for the badge
  const getBadgeImage = (badge: Badge) => {
    return badge.image || badge.image_url || `/badges/${badge.id}.png`;
  };

  // Check if badge is unlocked
  const isBadgeUnlocked = (badge: Badge) => {
    return Boolean(badge.unlockedAt);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {showSeeAll && onSeeAll && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1" 
              onClick={onSeeAll}
            >
              <span className="text-sm">Voir tout</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {sortedBadges.slice(0, 6).map((badge) => {
            // Determine if the badge is unlocked
            const isUnlocked = isBadgeUnlocked(badge);
            
            // Get badge rarity class (for the badge border/glow)
            const rarityColor = badge.tier ? getBadgeRarityColor(badge.tier) : 'bg-slate-500';
            
            return (
              <div 
                key={badge.id}
                className="flex flex-col items-center text-center"
              >
                <div className={`
                  relative w-16 h-16 md:w-18 md:h-18 rounded-full overflow-hidden
                  ${isUnlocked ? 'ring-2 ring-offset-2 ' + rarityColor : 'opacity-50 grayscale'}
                `}>
                  <img 
                    src={getBadgeImage(badge)}
                    alt={badge.name}
                    className="w-full h-full object-cover"
                  />
                  {!isUnlocked && badge.progress !== undefined && badge.progress > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                      {badge.progress}%
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h4 className="text-xs font-medium">{badge.name}</h4>
                  {isUnlocked && badge.unlockedAt && (
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesWidget;
