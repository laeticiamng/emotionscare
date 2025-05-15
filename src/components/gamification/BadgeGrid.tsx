
import React from 'react';
import { Badge } from '@/types';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface BadgeGridProps {
  badges: Badge[];
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ badges }) => {
  // Group badges by category if available
  const groupedBadges: Record<string, Badge[]> = {};
  
  badges.forEach(badge => {
    const category = badge.category || 'Général';
    if (!groupedBadges[category]) {
      groupedBadges[category] = [];
    }
    groupedBadges[category].push(badge);
  });
  
  return (
    <div>
      {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-medium mb-3">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryBadges.map(badge => (
              <Card 
                key={badge.id} 
                className={`p-4 flex flex-col items-center text-center ${!badge.unlocked ? 'opacity-60' : ''}`}
              >
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {badge.image_url || badge.imageUrl ? (
                      <img 
                        src={badge.image_url || badge.imageUrl} 
                        alt={badge.name} 
                        className="w-12 h-12"
                      />
                    ) : (
                      <span className="text-2xl">{badge.icon || '🏆'}</span>
                    )}
                  </div>
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-sm">{badge.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      {badges.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun badge n'a encore été débloqué.</p>
        </div>
      )}
    </div>
  );
};

export default BadgeGrid;
