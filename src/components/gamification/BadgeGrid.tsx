// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { RevealContainer } from '@/experience/components/RevealContainer';
import { useImmersionLevel } from '@/experience/hooks/useAmbient';

// Use the badge normalization utility
import { normalizeBadge, normalizeBadges } from '@/utils/badgeUtils';

interface BadgeGridProps {
  badges: any[];
  className?: string;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges, className = '' }) => {
  const immersionLevel = useImmersionLevel();

  return (
    <Card className={className}>
      <CardContent className="grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {badges.map((badge) => {
          const badgeImage = badge.imageUrl || badge.image || badge.image_url || badge.icon_url || '/badges/placeholder.svg';
          const isUnlocked = badge.completed || badge.unlocked || !!badge.unlockedAt;

          return (
            <RevealContainer
              key={badge.id}
              revealed={isUnlocked}
              glowAfterReveal={badge.tier === 'legendary' || badge.tier === 'gold'}
              duration={500}
            >
              <div className="relative">
                <div className={`${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`}>
                  <img
                    src={badgeImage}
                    alt={badge.name}
                    className="w-full aspect-square rounded-xl object-cover"
                  />
                </div>

                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs p-1 rounded-b-xl">
                  <span className="font-medium">{badge.name}</span>
                  <span className="block text-muted-foreground">{badge.tier || 'bronze'}</span>
                </div>
              </div>
            </RevealContainer>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BadgeGrid;
