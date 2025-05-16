
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/types';
import { BadgeCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeGridProps {
  badges: Badge[];
  className?: string;
  columns?: number;
}

const BadgeGrid: React.FC<BadgeGridProps> = ({ 
  badges = [], 
  className = '',
  columns = 3
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
  };

  const columnsClass = gridClasses[columns as keyof typeof gridClasses] || gridClasses[3];
  
  return (
    <div className={cn('grid gap-4', columnsClass, className)}>
      {badges.map((badge) => (
        <BadgeCard 
          key={badge.id} 
          badge={badge} 
          unlocked={badge.unlockedAt !== null && badge.unlockedAt !== undefined} 
        />
      ))}
    </div>
  );
};

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, unlocked }) => {
  // Get the image URL, handling various property names
  const imageUrl = badge.imageUrl || badge.image_url || badge.image;
  
  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      unlocked ? 'border-primary/30' : 'border-gray-200 opacity-70'
    )}>
      <div className="relative">
        <div className="w-full aspect-square flex items-center justify-center bg-muted">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={badge.name} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary">
              {badge.icon ? badge.icon : <BadgeCheck className="w-12 h-12" />}
            </div>
          )}
          
          {!unlocked && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      
      <CardHeader className="py-2">
        <h3 className="font-medium text-center">{badge.name}</h3>
      </CardHeader>
      
      <CardContent className="py-2 text-center">
        <CardDescription className="text-xs">
          {badge.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="pt-0 pb-3 justify-center">
        <div className="text-xs text-muted-foreground">
          {unlocked ? (
            <span className="flex items-center">
              <BadgeCheck className="w-3 h-3 mr-1 text-green-500" />
              Débloqué {badge.unlockedAt && new Date(badge.unlockedAt).toLocaleDateString()}
            </span>
          ) : (
            <span className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Non débloqué
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BadgeGrid;
