
import React from 'react';
import { Badge as BadgeType } from '@/types/gamification';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award } from 'lucide-react';

interface BadgesWidgetProps {
  badges: BadgeType[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  limit?: number;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({
  badges,
  title = "Badges débloqués",
  showSeeAll = false,
  onSeeAll,
  limit = 4
}) => {
  const displayedBadges = badges.slice(0, limit);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {displayedBadges.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-3">
              <Award className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <p className="text-muted-foreground">Aucun badge débloqué pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {displayedBadges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${badge.tier === 'bronze' ? 'bg-amber-100' : ''}
                    ${badge.tier === 'silver' ? 'bg-gray-200' : ''}
                    ${badge.tier === 'gold' ? 'bg-amber-200' : ''}
                    ${badge.tier === 'platinum' ? 'bg-blue-100' : ''}
                  `}
                >
                  {badge.imageUrl || badge.image_url || badge.image ? (
                    <img 
                      src={badge.imageUrl || badge.image_url || badge.image || ''} 
                      alt={badge.name} 
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Award className="h-6 w-6" />
                  )}
                </div>
                <h3 className="text-xs font-medium text-center line-clamp-1">
                  {badge.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {showSeeAll && badges.length > 0 && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={onSeeAll}
          >
            Voir tous les badges
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BadgesWidget;
