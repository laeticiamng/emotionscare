
import React from 'react';
import { Badge } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Lock } from 'lucide-react';

interface BadgeGridProps {
  badges: Badge[];
  className?: string;
  onSelectBadge?: (badge: Badge) => void;
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ 
  badges, 
  className = "", 
  onSelectBadge 
}) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Aucun badge disponible pour le moment.
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {badges.map((badge) => (
        <Card 
          key={badge.id} 
          className={`cursor-pointer transition-all hover:shadow-md ${badge.unlocked ? 'bg-background' : 'bg-muted/40'}`}
          onClick={() => onSelectBadge && onSelectBadge(badge)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span className="truncate">{badge.name}</span>
              {badge.unlocked ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription className="truncate">
              {badge.category || 'Achievement'}
              {/* Note: Fixed the type issue by using category instead of 'type' */}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            {badge.icon ? (
              <div className="text-4xl flex items-center justify-center">
                {badge.icon === 'award' ? (
                  <Award className="h-16 w-16 text-primary" />
                ) : (
                  <span>{badge.icon}</span>
                )}
              </div>
            ) : badge.imageUrl || badge.image_url ? (
              <img 
                src={badge.imageUrl || badge.image_url} 
                alt={badge.name}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <Award className="h-16 w-16 text-primary opacity-50" />
            )}
          </CardContent>
          <CardFooter className="text-xs text-center text-muted-foreground">
            {badge.description}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BadgeGrid;
