
import React from 'react';
import { Badge as BadgeType } from '@/types/gamification';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { BadgesWidgetProps } from '@/types/widgets';

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ 
  badges,
  title = "Vos badges",
  showSeeAll = false,
  onSeeAll
}) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Aucun badge débloqué pour le moment
      </div>
    );
  }
  
  // Sort badges: unlocked first, then by level
  const sortedBadges = [...badges].sort((a, b) => {
    // First sort by completion status
    if ((a.completed || a.unlocked) && !(b.completed || b.unlocked)) return -1;
    if (!(a.completed || a.unlocked) && (b.completed || b.unlocked)) return 1;
    
    // Then sort by level if both have same completion status
    const levelA = a.level || 0;
    const levelB = b.level || 0;
    return levelB - levelA;
  });
  
  return (
    <div className="space-y-4">
      {sortedBadges.slice(0, 3).map((badge) => (
        <div 
          key={badge.id}
          className={`flex items-start p-2 rounded-lg ${
            badge.completed || badge.unlocked ? 'bg-primary/5' : 'bg-muted/50'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg ${badge.completed || badge.unlocked ? 'bg-primary/20' : 'bg-muted'} flex items-center justify-center mr-3`}>
            <span className="text-lg">{badge.icon}</span>
          </div>
          
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">
                {badge.name}
              </h3>
              {badge.level && (
                <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">
                  Niv. {badge.level}
                </span>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">{badge.description}</p>
            
            {!(badge.completed || badge.unlocked) && badge.progress !== undefined && (
              <div className="mt-1 flex items-center">
                <div className="w-full bg-muted h-1.5 rounded-full">
                  <div 
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${badge.progress}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-muted-foreground">{badge.progress}%</span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {showSeeAll && badges.length > 3 && (
        <Button 
          variant="ghost" 
          className="w-full justify-between"
          onClick={onSeeAll}
        >
          Voir tous vos badges
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default BadgesWidget;
