
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/types/badge';

interface BadgesWidgetProps {
  badges: Badge[];
  className?: string;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ badges, className }) => {
  const recentBadges = badges
    .filter(badge => badge.unlocked || badge.unlockedAt || badge.unlocked_at)
    .sort((a, b) => {
      const dateA = new Date(a.date || a.unlockedAt || a.unlocked_at || '').getTime();
      const dateB = new Date(b.date || b.unlockedAt || b.unlocked_at || '').getTime();
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
                  {badge.image_url || badge.imageUrl ? (
                    <img 
                      src={badge.image_url || badge.imageUrl} 
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
