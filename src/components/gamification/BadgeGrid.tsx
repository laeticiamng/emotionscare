import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

// Use the badge normalization utility
import { normalizeBadge, normalizeBadges } from '@/utils/badgeUtils';

interface BadgeGridProps {
  badges: any[];
  className?: string;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges, className = '' }) => {
  return (
    <Card className={className}>
      <CardContent className="grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {badges.map((badge, index) => {
          // Replace image_url with imageUrl
          const badgeImage = badge.imageUrl || badge.image || badge.image_url || badge.icon_url || '/badges/placeholder.svg';

          // Replace unlocked with completed or unlockedAt check
          const isUnlocked = badge.completed || badge.unlocked || !!badge.unlockedAt;

          return (
            <div key={badge.id} className="relative">
              {/* Replace unlocked with completed or unlockedAt check */}
              <div className={`${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`}>
                <img
                  src={badgeImage}
                  alt={badge.name}
                  className="w-full aspect-square rounded-xl object-cover"
                />
              </div>

              {/* Replace unlocked with completed or unlockedAt check */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs p-1 rounded-b-xl">
                {/* Replace level with tier if needed */}
                <span className="font-medium">{badge.name}</span>
                <span className="block text-muted-foreground">{badge.tier || 'bronze'}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BadgeGrid;
