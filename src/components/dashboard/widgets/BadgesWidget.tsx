
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/types/badge';

interface BadgesWidgetProps {
  badges: Badge[];
  className?: string;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ badges, className }) => {
  const recentBadges = badges
    .filter(badge => badge.earned || badge.achieved || badge.unlocked)
    .sort((a, b) => {
      // Get date values, prioritizing standard fields and falling back to compatibility fields
      const dateA = new Date(
        a.date_earned || a.dateAwarded || a.unlockedAt || a.unlocked_at || a.timestamp || ''
      ).getTime();
      const dateB = new Date(
        b.date_earned || b.dateAwarded || b.unlockedAt || b.unlocked_at || b.timestamp || ''
      ).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {recentBadges.map(badge => (
              <div key={badge.id} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  {badge.imageUrl || badge.image_url || badge.image ? (
                    <img 
                      src={badge.imageUrl || badge.image_url || badge.image} 
                      alt={badge.name} 
                      className="w-12 h-12" 
                    />
                  ) : (
                    <div className="text-2xl">🏆</div>
                  )}
                </div>
                <span className="text-sm font-medium">{badge.name}</span>
                <span className="text-xs text-muted-foreground">{badge.description}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>You have not earned any badges yet.</p>
            <p className="text-sm">Complete challenges to earn badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesWidget;
