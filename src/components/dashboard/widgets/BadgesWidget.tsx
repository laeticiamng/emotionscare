
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/types/gamification';
import { ChevronRight } from 'lucide-react';

interface BadgesWidgetProps {
  badges: Badge[];
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  title?: string;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({ 
  badges, 
  showSeeAll = false, 
  onSeeAll, 
  title = "Mes badges" 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {showSeeAll && onSeeAll && (
          <Button variant="ghost" size="sm" onClick={onSeeAll} className="h-8 px-2">
            Tout voir <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Aucun badge pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br mb-2 flex items-center justify-center
                  ${badge.tier === 'bronze' ? 'from-amber-200 to-amber-300' :
                    badge.tier === 'silver' ? 'from-gray-300 to-gray-400' :
                    badge.tier === 'gold' ? 'from-yellow-300 to-yellow-400' :
                    badge.tier === 'platinum' ? 'from-blue-300 to-blue-400' :
                    'from-purple-300 to-purple-400'
                  }`}>
                  {badge.imageUrl ? (
                    <img 
                      src={badge.imageUrl} 
                      alt={badge.name} 
                      className="w-10 h-10 object-contain" 
                    />
                  ) : (
                    <div className="text-2xl">{badge.name.substring(0, 1)}</div>
                  )}
                </div>
                <h3 className="text-sm font-medium truncate max-w-full">{badge.name}</h3>
                {!badge.completed && badge.progress !== undefined && (
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${badge.progress}%` }} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgesWidget;
