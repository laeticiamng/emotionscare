
import React from 'react';
import { Badge } from '@/types/gamification';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BadgesWidgetProps {
  badges: Badge[];
  title?: string;
  className?: string;
  showMore?: boolean;
  onShowMore?: () => void;
}

const BadgesWidget: React.FC<BadgesWidgetProps> = ({
  badges,
  title = "Badges débloqués",
  className,
  showMore = false,
  onShowMore
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {badges.slice(0, 6).map((badge) => (
            <div key={badge.id} className="flex flex-col items-center text-center p-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                {badge.icon ? (
                  <span>{badge.icon}</span>
                ) : (
                  <span className="text-lg">🏆</span>
                )}
              </div>
              <div className="text-xs font-medium line-clamp-1">{badge.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
      {showMore && (
        <CardFooter>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-primary"
            onClick={onShowMore}
          >
            Voir tous les badges
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BadgesWidget;
